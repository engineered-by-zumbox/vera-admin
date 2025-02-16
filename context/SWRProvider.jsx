"use client";

import { SWRConfig } from "swr";
import fetcher from "@/services/fetcher";

export default function SWRProviders({ children }) {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
}
