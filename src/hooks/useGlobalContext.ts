import { useContext } from "react";

import { GlobalContext } from "@/contexts/GlobalContext";

export const useGlobalContext = () => {
  const value = useContext(GlobalContext);

  if (!value) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }

  return value;
};
