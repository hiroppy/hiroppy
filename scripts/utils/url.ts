export function normalizeUrl(url: string): string {
  // Parse the URL to handle it properly
  try {
    const urlObj = new URL(url);

    // Skip normalization for URLs with query parameters or fragments
    if (urlObj.search || urlObj.hash) {
      return url;
    }

    // Check if pathname ends with a file extension
    const pathname = urlObj.pathname;
    const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(
      pathname.split("/").pop() || "",
    );

    // Add trailing slash if needed
    if (!hasFileExtension && !pathname.endsWith("/")) {
      urlObj.pathname = `${pathname}/`;
      return urlObj.toString();
    }

    return url;
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}
