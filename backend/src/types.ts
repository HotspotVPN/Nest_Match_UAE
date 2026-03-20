import { Context } from 'hono';

export type Env = {
  DB: D1Database;
  IMAGES: R2Bucket;
  KYC_DOCS: R2Bucket;
  AVATARS: R2Bucket;
  JWT_SECRET: string;
  ALLOWED_ORIGIN: string;
  ENVIRONMENT: string;
};

export type JWTPayload = {
  sub: string;
  email: string;
  role: string;
  tier: number;
  iat: number;
  exp: number;
};

export type AppEnv = {
  Bindings: Env;
  Variables: { user: JWTPayload };
};

export type HonoContext = Context<AppEnv>;
