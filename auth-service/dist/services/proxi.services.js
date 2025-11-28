import { createProxyMiddleware } from 'http-proxy-middleware';

export class ProxyService {
  static createClinicalProxy() {
    return createProxyMiddleware({
      target: process.env.CLINICAL_SERVICE_URL || 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: {
        '^/api/clinical': '/api'  // /api/clinical/patients → /api/patients
      },
      on: {
        proxyReq: (proxyReq, req) => {
          console.log('🔀 Redirigiendo a Clínica:', req.url);
        }
      }
    });
  }

  static createGenomicsProxy() {
    return createProxyMiddleware({
      target: process.env.GENOMICS_SERVICE_URL || 'http://localhost:3002',
      changeOrigin: true,
      pathRewrite: {
        '^/api/genomics': '/api'  // /api/genomics/genes → /api/genes
      },
      on: {
        proxyReq: (proxyReq, req) => {
          console.log('🔀 Redirigiendo a Genómica:', req.url);
        }
      }
    });
  }

  // Proxy para las rutas estándar del proyecto
  static createStandardProxy() {
    return (req, res, next) => {
      const path = req.path;
      
      // Redirigir a MS Clínica
      if (path.startsWith('/api/patients') || path.startsWith('/api/tumors') || path.startsWith('/api/clinical-records')) {
        return createProxyMiddleware({
          target: process.env.CLINICAL_SERVICE_URL || 'http://localhost:3001',
          changeOrigin: true,
        })(req, res, next);
      }
      
      // Redirigir a MS Genómica
      if (path.startsWith('/api/genes') || path.startsWith('/api/variants') || path.startsWith('/api/reports')) {
        return createProxyMiddleware({
          target: process.env.GENOMICS_SERVICE_URL || 'http://localhost:3002',
          changeOrigin: true,
        })(req, res, next);
      }
      
      next();
    };
  }
}