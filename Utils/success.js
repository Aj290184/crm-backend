export const success = (res, statusCode = 200, message, data = null) => {
  return res.status(statusCode).json({
    status: "Success",
    message : message,
    data : data,
  });
};
