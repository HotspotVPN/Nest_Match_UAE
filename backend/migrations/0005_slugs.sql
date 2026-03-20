-- 0005_slugs.sql: Add URL slug columns for SEO-friendly routes
ALTER TABLE properties ADD COLUMN slug TEXT UNIQUE;
ALTER TABLE users ADD COLUMN slug TEXT UNIQUE;
