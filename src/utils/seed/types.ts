
// Common types used across seed utilities

export interface SeedSuccessResult {
  success: true;
  count: number;
  data?: any[];
  message?: string;
}

export interface SeedErrorResult {
  success: false;
  error: string;
}

export type SeedResult = SeedSuccessResult | SeedErrorResult;

// Type guard to check if a result is an error
export const isSeedErrorResult = (result: SeedResult): result is SeedErrorResult => {
  return !result.success;
};

// Type guard to check if a result is a success
export const isSeedSuccessResult = (result: SeedResult): result is SeedSuccessResult => {
  return result.success;
};
