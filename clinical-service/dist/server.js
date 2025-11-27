"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// clinical-service/src/server.ts
const app_1 = __importDefault(require("./app"));
const env_config_1 = require("./config/env.config");
const database_config_1 = require("./config/database.config");
const PORT = env_config_1.config.PORT;
async function startServer() {
    try {
        // Inicializar base de datos
        await (0, database_config_1.initializeDatabase)();
        console.log('✅ Base de datos clínica inicializada');
        // Iniciar servidor
        app_1.default.listen(PORT, () => {
            console.log(`🏥 Clinical Service ejecutándose en puerto ${PORT}`);
            console.log(`🌍 Ambiente: ${env_config_1.config.NODE_ENV}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
        });
    }
    catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}
// Manejo de cierre graceful
process.on('SIGINT', async () => {
    console.log('🛑 Cerrando Clinical Service...');
    await database_config_1.connectionPool.end();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('🛑 Cerrando Clinical Service...');
    await database_config_1.connectionPool.end();
    process.exit(0);
});
// Iniciar servidor
startServer();
