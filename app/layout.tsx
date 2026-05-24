import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Budget Monitoring System | DepEd SDO Cagayan",
  description:
    "Budget Monitoring and Management System – Schools Division Office of Cagayan, Department of Education, Region II",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F1F4F8] min-h-screen">
        {children}
      </body>
    </html>
  );
}
