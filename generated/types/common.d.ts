
/**
 * Metadata for a web link
 */
export interface LinkMeta {
  /**
   * Page title
   */
  title?: string;
  /**
   * Page description
   */
  description?: string;
  /**
   * Page image (WebP format, base64 encoded path)
   */
  image?: string;
  /**
   * Site or platform name
   */
  name?: string;
  /**
   * Page URL
   */
  url?: string;
  /**
   * Error message if crawling failed
   */
  error?: string;
}
