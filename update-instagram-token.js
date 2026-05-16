require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

async function main() {
  const shortToken = "EAAbvJ7zotKMBRfMeYEbTxCMgxeTtqvcbbViqcPpZAQd0wWxpV3miMfaWWGp6wT2cWmoxYmNOuLsi1pZBcfbP6mYegY0bHyPgmHfzaE6DBSUVNMss4m7ijTkebd5euIfLGGLUFU9vEn1kbcLZC0XGO571IZBagbn59tp1tcvcTQSsBvb11PcbnpI8PJrtk2y1AGV746HqEj4E9j9MkIqsGvfZAUIKBA7pDADAJQOdUxyxrcbA25fZAMXBZAf7c6hP2x23OdjUpvpVZBJmSyJinfZApT3TQlQZDZD";
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (!appId || !appSecret) {
    console.error("Missing META_APP_ID or META_APP_SECRET in .env");
    return;
  }

  console.log("Exchanging short-lived token for a long-lived token...");
  const url = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error("Failed to exchange token. It might already be expired or invalid:");
      console.error(data.error.message);
      return;
    }

    const longLivedToken = data.access_token;
    console.log("Successfully obtained long-lived token!");

    // Update .env file
    let envContent = fs.readFileSync(".env", "utf8");
    envContent = envContent.replace(/INSTAGRAM_ACCESS_TOKEN=.*/, `INSTAGRAM_ACCESS_TOKEN=${longLivedToken}`);
    fs.writeFileSync(".env", envContent);
    console.log("Updated .env with the new long-lived token.");

    // Save to Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from("instagram_tokens").upsert({
        id: 1,
        access_token: longLivedToken,
        updated_at: new Date().toISOString()
      }, { onConflict: "id" });

      if (error) {
        console.error("Failed to save token to Supabase:", error.message);
      } else {
        console.log("Token successfully saved to Supabase 'instagram_tokens' table.");
      }
      
      // Also clear out the instagram_media table so that it is forced to fetch fresh URLs
      // Actually we don't need to clear it, we can just trigger a refresh
      const { error: mediaError } = await supabase.from("instagram_media").delete().neq('id', '0');
      if (mediaError) {
        console.error("Failed to clear instagram_media:", mediaError.message);
      } else {
        console.log("Cleared old cached media from instagram_media table.");
      }
      
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
