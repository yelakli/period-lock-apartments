
import React, { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";

interface BookingTesterProps {
  apartmentId: string;
}

const BookingTester: React.FC<BookingTesterProps> = ({ apartmentId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
  const { testNormalBooking } = useBooking();

  const runTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const success = await testNormalBooking(apartmentId);
      
      if (success) {
        setTestResult({
          success: true,
          message: "Booking test successful! A test booking was created."
        });
      } else {
        setTestResult({
          success: false,
          message: "Booking test failed. Check the console for more details."
        });
      }
    } catch (error) {
      console.error("Error during booking test:", error);
      setTestResult({
        success: false,
        message: "An error occurred during the booking test. See console for details."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium">Booking System Test</h3>
        <Button 
          onClick={runTest} 
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? "Testing..." : "Test Normal Booking"}
        </Button>
      </div>
      
      {testResult && (
        <Alert variant={testResult.success ? "default" : "destructive"}>
          <div className="flex items-start gap-2">
            {testResult.success ? 
              <CheckCircle2 className="h-5 w-5 text-green-600" /> : 
              <XCircle className="h-5 w-5 text-red-600" />
            }
            <div>
              <AlertTitle>{testResult.success ? "Success" : "Failed"}</AlertTitle>
              <AlertDescription className="text-sm">
                {testResult.message}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default BookingTester;
