
import React from "react";
import Navbar from "./Navbar";
import { useBooking } from "@/context/BookingContext";

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className={fullWidth ? "w-full" : "container mx-auto px-4 py-8"}>
        {children}
      </main>
      <footer className="bg-white border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Apartment Booking System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
