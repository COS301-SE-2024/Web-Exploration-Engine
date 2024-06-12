export interface ErrorResponse {
  status: number;
  code: string;
  message: string;
}

export interface RobotsResponse {
  allowedPaths: string[];
  isBaseUrlAllowed: boolean;
}
