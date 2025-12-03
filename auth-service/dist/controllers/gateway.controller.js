const gatewayService = require('../services/gateway.service');

exports.routeToClinical = async (req, res) => {
  try {
    console.log('🔁 Redirigiendo a Clinical Service:', req.originalUrl);
    await gatewayService.proxyRequest(req, res, 'clinical');
  } catch (error) {
    console.error('❌ Error gateway clinical:', error);
    res.status(500).json({ error: 'Gateway clinical error' });
  }
};

exports.routeToGenomics = async (req, res) => {
  try {
    console.log('🔁 Redirigiendo a Genomics Service:', req.originalUrl);
    await gatewayService.proxyRequest(req, res, 'genomics');
  } catch (error) {
    console.error('❌ Error gateway genomics:', error);
    res.status(500).json({ error: 'Gateway genomics error' });
  }
};