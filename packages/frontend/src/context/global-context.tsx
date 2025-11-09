import { createContext, useContext, useState, type ReactNode } from "react";

export type GlobalContextType = {
  test: string | null;
  setTest: React.Dispatch<React.SetStateAction<string | null>>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [test, setTest] = useState<string | null>(null);

  return (
    <GlobalContext.Provider
      value={{
        test,
        setTest,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within an GlobalProvider");
  }
  return context;
}