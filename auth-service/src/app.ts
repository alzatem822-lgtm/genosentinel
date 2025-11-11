import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/auth.middleware';
import { envConfig } from './config/env.config';
import { testConnection } from './config/database.config';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeDatabase();
  }

  private initializeMiddlewares(): void {
    // Seguridad básica
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:4200',
      credentials: true
    }));

    // Parseo de JSON
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Logging de requests
    console.log('🛡️  Middlewares de seguridad y CORS configurados');
  }

  private initializeRoutes(): void {
    // Ruta principal
    this.app.get('/', (req, res) => {
      res.status(200).json({
        success: true,
        message: '🚀 GenoSentinel - Auth Service',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: envConfig.nodeEnv
      });
    });

    // Rutas de autenticación
    this.app.use('/auth', authRoutes);

    console.log('🛣️  Rutas inicializadas correctamente');
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
    console.log('🚨 Manejo de errores configurado');
  }

  private async initializeDatabase(): Promise<void> {
    try {
      const isConnected = await testConnection();
      if (isConnected) {
        console.log('🗄️  Base de datos conectada exitosamente');
      } else {
        console.log('⚠️  Base de datos no disponible');
      }
    } catch (error) {
      console.error('❌ Error inicializando base de datos:', error);
    }
  }

  public getServer(): express.Application {
    return this.app;
  }
}

export default App;