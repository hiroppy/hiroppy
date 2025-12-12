export function normalizeUrl(url: string): string {
  // Parse the URL to handle it properly
  try {
    const urlObj = new URL(url);

    // Skip normalization for URLs with query parameters or fragments
    if (urlObj.search || urlObj.hash) {
      return url;
    }

    // Skip normalization for Google Docs URLs
    if (urlObj.hostname === "docs.google.com") {
      return url;
    }

    // Check if pathname ends with a file extension
    const pathname = urlObj.pathname;
    const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(
      pathname.split("/").pop() || "",
    );

    // Remove trailing slash if present (except for root paths)
    if (!hasFileExtension && pathname !== "/" && pathname.endsWith("/")) {
      urlObj.pathname = pathname.slice(0, -1);
      return urlObj.toString();
    }

    return url;
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}
