export interface ErrorResponse {
  status: number;
  code: string;
  message: string;
}

export interface RobotsResponse {
  baseUrl: string;
  allowedPaths: string[];
  isBaseUrlAllowed: boolean;
}

export interface Metadata {
  title: string | null;
  description: string | null;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}