export async function refreshInstagramToken(currentToken: string): Promise<string> {
  let url = "";

  if (currentToken.startsWith("EAA")) {
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    
    if (!appId || !appSecret) {
      throw new Error("Missing META_APP_ID or META_APP_SECRET for Facebook token exchange");
    }
    
    url = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${currentToken}`;
  } else {
    url = `https://graph.facebook.com/v18.0/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`;
  }

  try {
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to refresh token");
    }

    const data = await response.json();
    if (!data?.access_token) {
      throw new Error("Instagram refresh response did not include an access token.");
    }

    return data.access_token;
  } catch (error) {
    console.error("Instagram token refresh failed:", error instanceof Error ? error.message : "Unknown error");
    throw error;
  }
}
