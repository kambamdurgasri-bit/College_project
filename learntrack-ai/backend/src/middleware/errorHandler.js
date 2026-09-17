// Central error handler (Rule 17 — never leak stack traces / raw DB errors to the client).
export default function errorHandler(err, req, res, _next) {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.publicMessage || "Something went wrong. Please try again.",
  });
}
