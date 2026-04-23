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
        throw new Error(`Request failed with ${response.status}`);
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
