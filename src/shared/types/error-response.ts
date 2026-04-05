export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, string>; 
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

export interface ApiMessageResponse {
  message: string;
}
