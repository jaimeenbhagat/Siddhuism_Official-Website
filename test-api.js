const { loadEnvConfig } = require('@next/env');
loadEnvConfig('./');

async function test() {
  const res = await fetch('http://localhost:3000/api/instagram?refresh=1');
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text.substring(0, 1000));
}
test();
