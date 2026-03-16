import { Hono } from 'hono';
import { Env } from '../types';
import { auth as authMiddleware } from '../middleware/auth';

const kyc = new Hono<{ Bindings: Env }>();

// POST /api/kyc/upload — Upload KYC document to R2 KYC_DOCS bucket
kyc.post('/upload', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;

  // Parse multipart form data
  const formData = await c.req.formData();
  const file = formData.get('file') as File | null;
  const docType = formData.get('doc_type') as string | null;
  const passportNumber = formData.get('passport_number') as string | null;
  const visaType = formData.get('visa_type') as string | null;
  const nationality = formData.get('nationality') as string | null;

  if (!file || !docType) {
    return c.json({ error: 'file and doc_type are required' }, 400);
  }

  const validDocTypes = ['passport', 'visa_page', 'emirates_id', 'uae_pass'];
  if (!validDocTypes.includes(docType)) {
    return c.json({ error: `Invalid doc_type. Must be one of: ${validDocTypes.join(', ')}` }, 400);
  }

  // Upload to R2 KYC_DOCS bucket (NEVER IMAGES bucket per CLAUDE.md)
  const r2Key = `kyc/${user.sub}/${docType}_${Date.now()}.${file.name.split('.').pop() || 'bin'}`;
  const arrayBuffer = await file.arrayBuffer();
  await c.env.KYC_DOCS.put(r2Key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
    customMetadata: {
      user_id: user.sub,
      doc_type: docType,
      ...(passportNumber ? { passport_number: passportNumber } : {}),
      ...(visaType ? { visa_type: visaType } : {}),
      ...(nationality ? { nationality: nationality } : {}),
    },
  });

  // Insert kyc_documents record
  const docId = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO kyc_documents (id, user_id, doc_type, r2_key, review_status)
     VALUES (?, ?, ?, ?, 'pending')`
  ).bind(docId, user.sub, docType, r2Key).run();

  // Update user metadata if provided
  if (passportNumber || visaType || nationality) {
    const updates: string[] = [];
    const binds: string[] = [];
    if (passportNumber) { updates.push('passport_number = ?'); binds.push(passportNumber); }
    if (visaType) { updates.push('visa_type = ?'); binds.push(visaType); }
    if (nationality) { updates.push('nationality = ?'); binds.push(nationality); }

    if (updates.length > 0) {
      binds.push(user.sub);
      await c.env.DB.prepare(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`
      ).bind(...binds).run();
    }
  }

  // Check if this is first passport+visa upload => upgrade to tier0_passport
  if (docType === 'passport' || docType === 'visa_page') {
    const currentUser = await c.env.DB.prepare(
      'SELECT verification_tier FROM users WHERE id = ?'
    ).bind(user.sub).first<any>();

    // Only upgrade if currently at tier1_unverified (explorer)
    if (currentUser?.verification_tier === 'tier1_unverified') {
      const passportDoc = await c.env.DB.prepare(
        `SELECT id FROM kyc_documents WHERE user_id = ? AND doc_type = 'passport'`
      ).bind(user.sub).first<any>();

      const visaDoc = await c.env.DB.prepare(
        `SELECT id FROM kyc_documents WHERE user_id = ? AND doc_type = 'visa_page'`
      ).bind(user.sub).first<any>();

      if (passportDoc && visaDoc) {
        await c.env.DB.prepare(
          `UPDATE users SET verification_tier = 'tier0_passport' WHERE id = ?`
        ).bind(user.sub).run();

        // Write verification event
        const verEventId = crypto.randomUUID();
        await c.env.DB.prepare(
          `INSERT INTO verification_events (id, user_id, from_tier, to_tier, trigger, kyc_document_id, performed_by)
           VALUES (?, ?, 'tier1_unverified', 'tier0_passport', 'passport_upload', ?, ?)`
        ).bind(verEventId, user.sub, docId, user.sub).run();
      }
    }
  }

  return c.json({
    success: true,
    document: { id: docId, doc_type: docType, review_status: 'pending', uploaded_at: new Date().toISOString() }
  }, 201);
});

// GET /api/kyc/my-documents — Return user's KYC documents (r2_key excluded for security)
kyc.get('/my-documents', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;

  const results = await c.env.DB.prepare(
    `SELECT id, user_id, doc_type, review_status, reviewed_by, reviewed_at, uploaded_at
     FROM kyc_documents WHERE user_id = ?`
  ).bind(user.sub).all<any>();

  return c.json(results.results);
});

// PATCH /api/kyc/:id/review — Compliance admin review
kyc.patch('/:id/review', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;

  // Only compliance admins can review
  if (user.role !== 'COMPLIANCE_ADMIN') {
    return c.json({ error: 'Forbidden — compliance admin only' }, 403);
  }

  const docId = c.req.param('id');
  const body = await c.req.json();
  const { status, notes } = body as { status?: string; notes?: string };

  if (!status || !['approved', 'rejected'].includes(status)) {
    return c.json({ error: 'status must be approved or rejected' }, 400);
  }

  const doc = await c.env.DB.prepare('SELECT * FROM kyc_documents WHERE id = ?')
    .bind(docId).first<any>();

  if (!doc) return c.json({ error: 'Document not found' }, 404);

  await c.env.DB.prepare(
    `UPDATE kyc_documents SET review_status = ?, reviewed_by = ?, reviewed_at = datetime('now') WHERE id = ?`
  ).bind(status, user.sub, docId).run();

  return c.json({ success: true, id: docId, review_status: status });
});

export default kyc;
