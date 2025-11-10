import React from 'react';

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>Auth App (frontend)</h1>
      <p>This is a minimal React entry so the dev server can run.</p>
      <p>
        To test the registration flow I added a small static page at
        <strong> /register.html</strong> — open it in the browser or from the project
        public folder.
      </p>
      <p>
        <a href="/register.html">Open static registration page</a>
      </p>
    </div>
  );
}
