"use client";

import { Toaster } from "sonner";

type AppProvidersProps = {
  children: React.ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 3500,
          classNames: {
            toast: "font-sans",
          },
        }}
      />
    </>
  );
}
