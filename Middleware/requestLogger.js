import logger from "../Config/logger.js";

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = `${Date.now() - start}ms`;

    const meta = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      ip: req.ip,
      duration,
      timestamp: new Date().toISOString(),
    };

    //Ignore CORS preflight
    if (req.method === "OPTIONS") return;

    //Ignore 401 (JWT expiry expected)
    if (res.statusCode === 401) return;

    //Ignore 304 (browser cache)
    if (res.statusCode === 304) return;

    if (res.statusCode >= 500) {
      logger.error("Server Error", meta);
    } 
    else if (res.statusCode >= 400) {
      logger.warn("Client Error", meta);
    } 
    else {
      logger.info("Request Success", meta);
    }
  });

  next();
};

export default requestLogger;