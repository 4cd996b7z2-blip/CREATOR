/**
 * True when the app runs on a real host rather than a laptop. Covers Vercel, Netlify (which runs on AWS Lambda),
 * Render, Railway, Fly and Google Cloud Run. Used as a safety net: fake-data mode must never run on a live site.
 */
export function isHosted(): boolean {
  const e = process.env;
  return Boolean(
    e.VERCEL ||
      e.NETLIFY ||
      e.RENDER ||
      e.RAILWAY_ENVIRONMENT ||
      e.FLY_APP_NAME ||
      e.K_SERVICE ||
      e.AWS_LAMBDA_FUNCTION_NAME ||
      e.AWS_EXECUTION_ENV,
  );
}
