const logger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const status = res.statusCode >= 400 ? '❌' : '✅';
      
      console.log(`${status} ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
      
      // Alerter si > 700ms (contrainte du projet)
      if (duration > 700) {
        console.warn(`⚠️  Requête lente détectée: ${duration}ms`);
      }
    });
    
    next();
  };
  
  module.exports = logger;