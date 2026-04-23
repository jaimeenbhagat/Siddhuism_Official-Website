export async function refreshInstagramToken(currentToken: string): Promise<string> {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error("META_APP_ID or META_APP_SECRET is not configured in the environment variables.");
  }

  const url = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${currentToken}`;

  try {
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to refresh token");
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Instagram token refresh failed:", error instanceof Error ? error.message : "Unknown error");
    throw error;
  }
}
