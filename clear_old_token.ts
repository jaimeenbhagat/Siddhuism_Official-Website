import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

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
