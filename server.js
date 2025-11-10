// Root shim for hosting platforms that run `node server.js` by default.
// This simply delegates to the real entry point at ./src/server.js

try {
  require('./src/server.js');
} catch (err) {
  console.error('Failed to start app from ./src/server.js');
  console.error(err);
  process.exit(1);
}
