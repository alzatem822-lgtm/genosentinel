"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_config_1 = require("./config/env.config");
const app = new app_1.default().getServer();
const PORT = env_config_1.envConfig.port;
const server = app.listen(PORT, () => {
    console.log('🚀 ========================================');
    console.log('🛡️  GenoSentinel - Auth Service');
    console.log('🚀 ========================================');
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🌍 Ambiente: ${env_config_1.envConfig.nodeEnv}`);
    console.log(`🗄️  Base de datos: ${env_config_1.envConfig.dbName}`);
    console.log(`⏰ Iniciado: ${new Date().toISOString()}`);
    console.log('🚀 ========================================');
    console.log('📚 Endpoints disponibles:');
    console.log(`   POST   http://localhost:${PORT}/auth/register`);
    console.log(`   POST   http://localhost:${PORT}/auth/login`);
    console.log(`   POST   http://localhost:${PORT}/auth/validate`);
    console.log(`   GET    http://localhost:${PORT}/auth/health`);
    console.log(`   GET    http://localhost:${PORT}/auth/gateway-test`);
    console.log('🚀 ========================================');
});
process.on('SIGINT', () => {
    console.log('\n🛑 Recibido SIGINT. Apagando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});
process.on('SIGTERM', () => {
    console.log('\n🛑 Recibido SIGTERM. Apagando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Rejection no manejado en:', promise, 'razón:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('❌ Excepción no capturada:', error);
    process.exit(1);
});
exports.default = server;
