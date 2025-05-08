
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Home, User, LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  const { userType, isAdminLoggedIn, adminLogout } = useBooking();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-lg text-gray-900">AOSRSM</span>
            </Link>
          </div>

          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition duration-150">
              Accueil
            </Link>
            {isAdminLoggedIn && (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition duration-150">
                Admin Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            <div className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 flex items-center">
              <User className="mr-1 h-3.5 w-3.5" />
              {userType === "admin" ? "Admin" : "User"}
            </div>
            
            {isAdminLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                Logout
              </Button>
            ) : (
              <Link to="/admin/login">
                <Button
                  variant="outline"
                  size="sm"
                >
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
