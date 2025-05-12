
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";

interface NormalBookingFormProps {
  apartmentId: string;
  apartmentPrice: number;
  minNights?: number;
  maxNights?: number;
  isNormalDateRangeAvailable: (apartmentId: string, startDate: Date, endDate: Date) => Promise<boolean>;
  createNormalBooking: (booking: any) => Promise<{
    success: boolean;
    booking?: any;
    error?: any;
  }>;
}

const NormalBookingForm: React.FC<NormalBookingFormProps> = ({
  apartmentId,
  apartmentPrice,
  minNights = 1,
  maxNights,
  isNormalDateRangeAvailable,
  createNormalBooking
}) => {
  const navigate = useNavigate();
  
  // State for booking data
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isDateRangeAvailable, setIsDateRangeAvailable] = useState<boolean | null>(null);
  
  // User information
  const [userData, setUserData] = useState({
    userName: "",
    userEmail: "",
    userPhone: ""
  });
  
  // Update user data
  const handleUserDataChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };
  
  // Check availability whenever date range changes
  useEffect(() => {
    if (startDate && endDate) {
      checkAvailability();
    } else {
      setIsDateRangeAvailable(null);
    }
  }, [startDate, endDate]);
  
  // Handle date range selection
  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  // Check if selected date range is available
  const checkAvailability = async () => {
    if (!startDate || !endDate || !apartmentId) return;
    
    // Validate date range against min/max nights constraint
    const validationResult = validateDateRange(startDate, endDate, minNights, maxNights);
    if (!validationResult.valid) {
      toast.error(validationResult.message);
      setIsDateRangeAvailable(false);
      return;
    }
    
    setIsCheckingAvailability(true);
    try {
      const isAvailable = await isNormalDateRangeAvailable(apartmentId, startDate, endDate);
      setIsDateRangeAvailable(isAvailable);
      
      if (!isAvailable) {
        toast.error("These dates are not available for booking");
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Failed to check availability");
      setIsDateRangeAvailable(false);
    } finally {
      setIsCheckingAvailability(false);
    }
  };
  
  // Handle booking submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast.error("Please select a date range");
      return;
    }
    
    if (!isDateRangeAvailable) {
      toast.error("Please select available dates before booking");
      return;
    }
    
    const { userName, userEmail, userPhone } = userData;
    if (!userName || !userEmail || !userPhone) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      const result = await createNormalBooking({
        apartmentId,
        userName,
        userEmail,
        userPhone,
        startDate,
        endDate
      });
      
      if (result.success) {
        toast.success("Reservation made successfully!");
        navigate("/");
      } else {
        toast.error(result.error?.message || "Failed to create booking. Please try again.");
      }
    } catch (error) {
      console.error("Booking creation failed:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmitBooking} className="space-y-6">
      {/* Date Range Picker Component */}
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={handleDateRangeChange}
        minNights={minNights}
        maxNights={maxNights}
        isCheckingAvailability={isCheckingAvailability}
        isDateRangeAvailable={isDateRangeAvailable}
      />
      
      {/* Show booking summary and form if dates are selected */}
      {startDate && endDate && (
        <>
          {/* Booking Summary Component */}
          <BookingSummary
            startDate={startDate}
            endDate={endDate}
            apartmentPrice={apartmentPrice}
            isDateRangeAvailable={isDateRangeAvailable}
            isCheckingAvailability={isCheckingAvailability}
            onCheckAvailability={checkAvailability}
          />
          
          {/* User Form - only show if dates are available */}
          {isDateRangeAvailable && (
            <BookingUserForm
              userData={userData}
              onUserDataChange={handleUserDataChange}
            />
          )}
        </>
      )}
      
      {/* Reserve Button - only enabled when all conditions are met */}
      {isDateRangeAvailable && (
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white transition-colors"
            disabled={!startDate || !endDate || !isDateRangeAvailable || 
                     !userData.userName || !userData.userEmail || !userData.userPhone}
          >
            Reserve
          </Button>
        </div>
      )}
    </form>
  );
};

export default NormalBookingForm;