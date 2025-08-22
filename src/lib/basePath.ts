// src/lib/basePath.ts

const isProd = process.env.NODE_ENV === 'production';
export const basePath = isProd ? '/blog-starter-app' : '';
