import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  console.log("Deleting old instagram token from app_config...");
  const { error } = await supabase.from("app_config").delete().eq("key", "instagram_token");
  if (error) {
    console.error("Error deleting:", error);
  } else {
    console.log("Success! Old token deleted. The new .env token will now be used.");
  }
}

run();
