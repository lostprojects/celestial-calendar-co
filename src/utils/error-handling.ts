import { logger } from "../lib/logger";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    logger.error(error.message, { code: error.code, context: error.context });
    return error.message;
  }
  
  if (error instanceof Error) {
    logger.error(error.message, { name: error.name, stack: error.stack });
    return error.message;
  }
  
  const fallbackMessage = 'An unexpected error occurred';
  logger.error(fallbackMessage, { rawError: error });
  return fallbackMessage;
}

export function createAppError(
  message: string,
  code?: string,
  context?: Record<string, unknown>
): AppError {
  return new AppError(message, code, context);
}
