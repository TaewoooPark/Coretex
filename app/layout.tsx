import type { Metadata } from "next";
import "@xyflow/react/dist/style.css";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "CORETEX",
  description: "Node-based collaborative document management system"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
