export class AppError extends Error {
  constructor(
    public code: string,
    message?: string
  ) {
    super(message || code);
    this.name = "AppError";
  }
}

const GLOBAL_ERROR_MAP: Record<string, string> = {
  INTERNAL_SERVER_ERROR: "Something went wrong on our end. Please try again.",
  UNAUTHORIZED: "You must be logged in to do that.",
  FORBIDDEN: "You don't have permission to perform this action.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
};

export function errorHandler(error: unknown, localMap: Record<string, string> = {}): string {
  if (error instanceof AppError || error instanceof Error) {
    const code = error.message;

    const message = localMap[code] || GLOBAL_ERROR_MAP[code];

    if (message) return message;

    return error.message || GLOBAL_ERROR_MAP.UNKNOWN_ERROR;
  }

  return GLOBAL_ERROR_MAP.UNKNOWN_ERROR;
}

export function simpleError(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage;
}
