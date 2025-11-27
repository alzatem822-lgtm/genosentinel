"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// clinical-service/src/config/env.config.ts
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('3020'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: zod_1.z.string().url(),
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'debug']).default('info')
});
exports.config = envSchema.parse(process.env);
