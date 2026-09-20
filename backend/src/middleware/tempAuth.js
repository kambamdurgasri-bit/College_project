// TEMPORARY stand-in for real JWT auth middleware.
//
// Once real JWT auth is pushed (something like
// `src/modules/auth/auth.middleware.js` exporting a `requireAuth` that
// verifies the JWT and sets `req.user = { id, email }`), swap every
// `import tempAuth from "../../middleware/tempAuth.js"` in this codebase
// for the real middleware and delete this file.
//
// For now, pass the id of a test user row via a header so you can develop
// and test your routes with Postman/curl without a login system:
//   x-user-id: 1
export default function tempAuth(req, res, next) {
  const userId = Number(req.header("x-user-id"));
  if (!userId) {
    return res.status(401).json({
      error: "Missing x-user-id header (temporary auth stub — not real auth).",
    });
  }
  req.user = { id: userId };
  next();
}
