
import React from "react";
import Navbar from "./Navbar";
import { useLanguage } from "@/context/LanguageContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { translate } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} {translate("apartment_booking")}. {translate("all_rights_reserved")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
