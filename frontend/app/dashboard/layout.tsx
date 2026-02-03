import { AuthProvider } from "@/context/AuthContext";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children : ReactNode} ) {
  return (                
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
