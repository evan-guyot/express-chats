export interface GlobalApiError {
  error: string;
}

export interface SchemaApiError extends GlobalApiError {
  details: SchemaApiErrorDetail[];
}

export interface SchemaApiErrorDetail {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
}

export const isSchemaApiError = (
  error: GlobalApiError | SchemaApiError
): error is SchemaApiError => {
  return (error as SchemaApiError).details !== undefined;
};
