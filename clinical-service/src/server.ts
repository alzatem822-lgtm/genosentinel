// clinical-service/src/server.ts
import app from './app';
import { config } from './config/env.config';
import { initializeDatabase, connectionPool } from './config/database.config';

const PORT = config.PORT;

async function startServer() {
  try {
    // Inicializar base de datos
    await initializeDatabase();
    console.log('✅ Base de datos clínica inicializada');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🏥 Clinical Service ejecutándose en puerto ${PORT}`);
      console.log(`🌍 Ambiente: ${config.NODE_ENV}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('🛑 Cerrando Clinical Service...');
  await connectionPool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Cerrando Clinical Service...');
  await connectionPool.end();
  process.exit(0);
});

// Iniciar servidor
startServer();