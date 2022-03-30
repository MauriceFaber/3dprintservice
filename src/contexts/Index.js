import { createContext, useContext } from "react";

export default function createCtx() {
  const context = createContext();

  function useCtx() {
    const ctx = useContext(context);
    if (!ctx) {
      throw new Error("useCtx must be inside a provider with a value.");
    }

    return ctx;
  }

  return [useCtx, context.Provider];
}
