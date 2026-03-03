export const errorHandler = (err, req, res, next) => {
  const statusCode =
    Number.isInteger(err?.statusCode) && err.statusCode >= 100
      ? err.statusCode
      : 500;

  const message = err?.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
