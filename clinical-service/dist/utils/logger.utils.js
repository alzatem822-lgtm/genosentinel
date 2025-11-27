"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
// clinical-service/src/utils/logger.utils.ts
const env_config_1 = require("../config/env.config");
class Logger {
    static error(message, meta) {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta || '');
    }
    static warn(message, meta) {
        if (env_config_1.config.LOG_LEVEL === 'error')
            return;
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta || '');
    }
    static info(message, meta) {
        if (env_config_1.config.LOG_LEVEL === 'error' || env_config_1.config.LOG_LEVEL === 'warn')
            return;
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || '');
    }
    static debug(message, meta) {
        if (env_config_1.config.LOG_LEVEL !== 'debug')
            return;
        console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta || '');
    }
}
exports.Logger = Logger;
