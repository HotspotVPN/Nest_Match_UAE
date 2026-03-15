import { Hono } from 'hono';
import { Env } from './types';
import { cors } from './middleware/cors';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import propertyRoutes from './routes/properties';
import viewingRoutes from './routes/viewings';
import ratingRoutes from './routes/ratings';
import paymentRoutes from './routes/payments';

const app = new Hono<{ Bindings: Env }>();

// Global Middleware
app.use('*', cors());

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/users', userRoutes);
app.route('/api/properties', propertyRoutes);
app.route('/api/viewings', viewingRoutes);
app.route('/api/ratings', ratingRoutes);
app.route('/api/payments', paymentRoutes);

app.get('/', (c) => {
  return c.text('NestMatch UAE API (Cloudflare Workers + Hono) is live!');
});

export default app;
