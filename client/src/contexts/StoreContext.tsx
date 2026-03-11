import React, { createContext, useContext, useState, useEffect } from "react";
import { STORES, Store, ALL_STORES_ID } from "@/data/stores";

interface StoreContextValue {
  stores: Store[];
  selectedStoreId: string;
  selectedStore: Store | null; // null means "All Stores"
  setSelectedStoreId: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEY = "blockeeper_selected_store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [selectedStoreId, setSelectedStoreIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? ALL_STORES_ID;
    } catch {
      return ALL_STORES_ID;
    }
  });

  const setSelectedStoreId = (id: string) => {
    setSelectedStoreIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  };

  const selectedStore =
    selectedStoreId === ALL_STORES_ID
      ? null
      : STORES.find((s) => s.id === selectedStoreId) ?? null;

  return (
    <StoreContext.Provider
      value={{ stores: STORES, selectedStoreId, selectedStore, setSelectedStoreId }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
