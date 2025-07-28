// This file extends the TypeScript types for testing libraries
import '@testing-library/jest-dom';
import { expect } from 'vitest';

// Extend the matchers from testing-library/jest-dom
declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T> {
    toBeInTheDocument(): T;
    toHaveTextContent(text: string | RegExp): T;
    toBeVisible(): T;
  }
}

export {};
