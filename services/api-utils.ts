type RetryOptions = {
  retries?: number;
  delayMs?: number;
};

export async function fetchJsonWithRetry<T>(url: string, options: RequestInit = {}, retryOptions: RetryOptions = {}) {
  const retries = retryOptions.retries ?? 2;
  const delayMs = retryOptions.delayMs ?? 450;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Accept: "application/json",
          ...(options.headers ?? {}),
        },
      });

      if (!response.ok) {
        // Try to read body to surface API error details
        let bodyText = "";
        try {
          bodyText = await response.text();
        } catch {
          bodyText = "<unreadable body>";
        }

        const message = `Request failed with ${response.status}: ${bodyText}`;
        const err = new Error(message);
        // Attach status for callers that want to handle it
        // @ts-expect-error add property
        err.status = response.status;
        throw err;
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed.");
}
