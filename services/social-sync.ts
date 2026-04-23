import { refreshInstagramSnapshot } from "@/services/instagram";
import { refreshYouTubeSnapshot } from "@/services/youtube";

export async function syncSocialData() {
  const [youtube, instagram] = await Promise.allSettled([
    refreshYouTubeSnapshot(),
    refreshInstagramSnapshot(),
  ]);

  return {
    youtube: youtube.status === "fulfilled" ? youtube.value : null,
    instagram: instagram.status === "fulfilled" ? instagram.value : null,
    syncedAt: new Date().toISOString(),
  };
}
