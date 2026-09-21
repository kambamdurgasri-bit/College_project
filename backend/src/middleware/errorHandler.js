// Central error handler (Rule 17 — never leak stack traces / raw DB errors to the client).
//
// 4xx errors are deliberate, user-facing messages (validation, conflicts,
// unsupported file type...) so they are passed through. 5xx errors are logged
// in full and replaced with a generic message.
export default function errorHandler(err, req, res, _next) {
  // Multer's own limit errors carry a code but no status.
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "That file is too large. The limit is 20MB." });
  }
  if (err?.code === "LIMIT_UNEXPECTED_FILE" || err?.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({ error: "Only one file can be uploaded at a time." });
  }

  const status = Number(err?.status || err?.statusCode) || 500;

  if (status >= 500) {
    console.error(err);
    return res.status(status).json({
      error: err?.publicMessage || "Something went wrong. Please try again.",
    });
  }

  res.status(status).json({
    error: err?.publicMessage || err?.message || "Request failed.",
  });
}
