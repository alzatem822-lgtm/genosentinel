import App from './app';
import { envConfig } from './config/env.config';

const app = new App().getServer();
const PORT = envConfig.port;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log('🚀 ========================================');
  console.log('🛡️  GenoSentinel - Auth Service');
  console.log('🚀 ========================================');
  console.log(`📍 Puerto: ${PORT}`);
  console.log(`🌍 Ambiente: ${envConfig.nodeEnv}`);
  console.log(`🗄️  Base de datos: ${envConfig.dbName}`);
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

// Manejo graceful de shutdown
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

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Rejection no manejado en:', promise, 'razón:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  process.exit(1);
});

export default server;