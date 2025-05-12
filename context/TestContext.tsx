import { createContext } from 'react';

interface TestContextValue {
  // TODO: Define test state shape
}

export const TestContext = createContext<TestContextValue | undefined>(undefined); 