// Standalone, dependency-free Vercel function.
// Proves the serverless platform is executing functions AND gives a quick
// liveness endpoint that never depends on the Express app starting.
module.exports = function ping(req, res) {
  res.status(200).json({ ok: true, service: 'havenstay-api', time: new Date().toISOString() });
};