export async function refreshInstagramToken(currentToken: string): Promise<string> {
  const url = `https://graph.facebook.com/v18.0/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`;

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
