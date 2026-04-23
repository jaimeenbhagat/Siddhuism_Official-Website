import { getSupabaseClient } from "@/lib/supabaseClient";

export type CachedSnapshot<T> = {
  platform: "youtube" | "instagram";
  data: T;
  fetchedAt: string;
  expiresAt: string;
};

const DEFAULT_TTL_MINUTES = 60;

function ttlDate(minutes = DEFAULT_TTL_MINUTES) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export async function readCachedSnapshot<T>(platform: CachedSnapshot<T>["platform"]) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("app_config")
    .select("value")
    .eq("key", `${platform}_snapshot`)
    .single();

  if (error || !data?.value) {
    return null;
  }

  try {
    const record = JSON.parse(data.value) as CachedSnapshot<T>;
    const expiresAt = new Date(record.expiresAt);
    if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < Date.now()) {
      return null;
    }
    return record;
  } catch {
    return null;
  }
}

export async function writeCachedSnapshot<T>(platform: CachedSnapshot<T>["platform"], data: T) {
  const snapshot: CachedSnapshot<T> = {
    platform,
    data,
    fetchedAt: new Date().toISOString(),
    expiresAt: ttlDate().toISOString(),
  };

  const supabase = getSupabaseClient();
  await supabase
    .from("app_config")
    .upsert({ key: `${platform}_snapshot`, value: JSON.stringify(snapshot) });

  return snapshot;
}
