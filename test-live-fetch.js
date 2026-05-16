const { loadEnvConfig } = require('@next/env');
loadEnvConfig('./');

async function test() {
  const { refreshInstagramSnapshot } = require('./services/instagram');
  try {
    const res = await refreshInstagramSnapshot();
    console.log("Success! Fetched", res.media.length);
  } catch (err) {
    console.error("Failed!", err.message, err.stack);
  }
}
test();
