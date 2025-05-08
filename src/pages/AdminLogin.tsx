
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBooking } from "@/context/BookingContext";
import { useLanguage } from "@/context/LanguageContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Lock, User } from "lucide-react";

interface LoginFormData {
  username: string;
  password: string;
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin, isAdminLoggedIn } = useBooking();
  const { translate } = useLanguage();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const form = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: ""
    }
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAdminLoggedIn) {
      navigate("/admin");
    }
  }, [isAdminLoggedIn, navigate]);

  const onSubmit = (data: LoginFormData) => {
    setIsLoggingIn(true);
    
    // Simulate a network request
    setTimeout(() => {
      const success = adminLogin(data.username, data.password);
      
      if (success) {
        toast.success(translate("login_success"));
        navigate("/admin");
      } else {
        toast.error(translate("login_error"));
      }
      
      setIsLoggingIn(false);
    }, 500);
  };

  return (
    <Layout>
      <div className="flex justify-center items-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">{translate("admin_title")}</CardTitle>
            <CardDescription>
              {translate("admin_description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate("username")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder={translate("username_placeholder")}
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate("password")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input
                            type="password"
                            placeholder={translate("password_placeholder")}
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? translate("logging_in") : translate("login")}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-gray-500">
              {translate("default_credentials")}
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminLogin;
