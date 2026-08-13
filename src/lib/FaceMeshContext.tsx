import React, { createContext, useContext, useRef } from "react";
import { FaceMeshEngine, FaceMeshEngineHandle } from "../components/FaceMeshEngine";

const FaceMeshContext = createContext<React.RefObject<FaceMeshEngineHandle | null> | null>(null);

export function FaceMeshProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<FaceMeshEngineHandle>(null);
  return (
    <FaceMeshContext.Provider value={ref}>
      {children}
      <FaceMeshEngine ref={ref} />
    </FaceMeshContext.Provider>
  );
}

export function useFaceMesh() {
  const ctx = useContext(FaceMeshContext);
  if (!ctx) throw new Error("useFaceMesh must be used within FaceMeshProvider");
  return ctx;
}
