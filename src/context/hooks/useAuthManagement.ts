
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthManagement = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [userType, setUserType] = useState<"admin" | "user">("user");

  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setIsAdminLoggedIn(true);
      setUserType("admin");
      return true;
    }
    return false;
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.session) {
        setIsAdminLoggedIn(true);
        setUserType("admin");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const adminLogout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setIsAdminLoggedIn(false);
      setUserType("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    isAdminLoggedIn,
    userType,
    setUserType,
    checkSession,
    adminLogin,
    adminLogout
  };
};
