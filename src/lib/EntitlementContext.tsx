import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { checkEntitlement, configurePurchases } from "./purchases";

type EntitlementState = {
  isSubscribed: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
};

const EntitlementContext = createContext<EntitlementState>({
  isSubscribed: false,
  loading: true,
  refresh: async () => {},
});

export function EntitlementProvider({ children }: { children: React.ReactNode }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (Platform.OS !== "ios") {
      setIsSubscribed(true); // don't block dev/preview on non-iOS platforms
      setLoading(false);
      return;
    }
    try {
      const active = await checkEntitlement();
      setIsSubscribed(active);
    } catch {
      setIsSubscribed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    configurePurchases();
    refresh();
  }, [refresh]);

  return (
    <EntitlementContext.Provider value={{ isSubscribed, loading, refresh }}>
      {children}
    </EntitlementContext.Provider>
  );
}

export function useEntitlement() {
  return useContext(EntitlementContext);
}
