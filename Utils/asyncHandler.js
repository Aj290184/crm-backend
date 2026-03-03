export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.log("Async handler caught an error:", error.message);
    next(error);
  }
};
