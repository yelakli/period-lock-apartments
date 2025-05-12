
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
  minNights,
  maxNights,
  isNormalDateRangeAvailable,
  createNormalBooking
}) => {
  const navigate = useNavigate();
  
  // State for normal booking
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isDateRangeAvailable, setIsDateRangeAvailable] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  
  // Calculate the number of nights for normal booking
  const nightsCount = startDate && endDate ? 
    differenceInDays(new Date(endDate), new Date(startDate)) : 0;

  // Calculate the total price for normal booking
  const totalPrice = apartmentPrice && nightsCount ? apartmentPrice * nightsCount : 0;
  
  const handleCheckAvailability = async () => {
    if (!startDate || !endDate || !apartmentId) return;
    
    setIsCheckingAvailability(true);
    try {
      const isAvailable = await isNormalDateRangeAvailable(apartmentId, startDate, endDate);
      setIsDateRangeAvailable(isAvailable);
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Failed to check availability");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (!startDate || (startDate && endDate)) {
      // If no start date is selected or both dates are selected, set the new date as the start date
      setStartDate(date);
      setEndDate(undefined);
      setIsDateRangeAvailable(null);
    } else {
      // If only the start date is selected and the new date is after the start date
      if (date > startDate) {
        setEndDate(date);
        // Reset availability until checked
        setIsDateRangeAvailable(null);
      } else {
        // If the new date is before or equal to the start date, update the start date
        setStartDate(date);
        setEndDate(undefined);
        setIsDateRangeAvailable(null);
      }
    }
  };
  
  const handleSubmitNormalBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !userName || !userEmail || !userPhone) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (!isDateRangeAvailable) {
      toast.error("Please check availability before booking");
      return;
    }
    
    const result = await createNormalBooking({
      apartmentId: apartmentId,
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
      toast.error("Failed to create booking. Please try again.");
      console.error("Booking creation failed:", result.error);
    }
  };

  return (
    <form onSubmit={handleSubmitNormalBooking} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Select Dates
        </label>
        <div className="text-xs text-gray-500 mb-2">
          {minNights && maxNights ? 
            `Min: ${minNights} nights | Max: ${maxNights} nights` : 
            minNights ? 
              `Min: ${minNights} nights` : 
              maxNights ? 
                `Max: ${maxNights} nights` : ""}
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                endDate ? (
                  <>
                    {format(startDate, "MMM dd, yyyy")} - {format(endDate, "MMM dd, yyyy")}
                  </>
                ) : (
                  format(startDate, "MMM dd, yyyy")
                )
              ) : (
                <span>Select dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleDateSelect}
              initialFocus
              disabled={(date) => date < new Date()}
              className={cn("p-3 pointer-events-auto")}
            />
            {startDate && !endDate && (
              <div className="px-4 py-2 border-t text-sm text-muted-foreground">
                Select an end date
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
      
      {startDate && endDate && (
        <>
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex items-start space-x-2">
              <CalendarIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-blue-700">
                  {format(startDate, "MMMM dd")} - {format(endDate, "MMMM dd, yyyy")}
                </p>
                <p className="text-sm text-blue-600">
                  {nightsCount} nights
                </p>
              </div>
            </div>
            
            <div className="mt-3 flex">
              <Button
                type="button"
                className="w-full"
                onClick={handleCheckAvailability}
                disabled={isCheckingAvailability}
              >
                {isCheckingAvailability ? "Checking..." : "Check Availability"}
              </Button>
            </div>
            
            {isDateRangeAvailable && (
              <div className={`mt-2 text-center text-sm ${isDateRangeAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {isDateRangeAvailable ? "✓ Available for booking" : "✗ Not available for the selected dates"}
              </div>
            )}
          </div>
          
          {isDateRangeAvailable && (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  {formatCurrency(apartmentPrice)} DH x {nightsCount} nights
                </span>
                <span className="font-medium">
                  {formatCurrency(totalPrice)} DH
                </span>
              </div>
              
              <div className="flex justify-between pt-3 border-t font-semibold">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)} DH</span>
              </div>
            </div>
          )}
        </>
      )}
      
      {isDateRangeAvailable && (
        <div className="space-y-4 pt-2">
          <div>
            <label htmlFor="normalName" className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <Input
              id="normalName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label htmlFor="normalEmail" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="normalEmail"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="normalPhone" className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <Input
              id="normalPhone"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!startDate || !endDate || !isDateRangeAvailable || !userName || !userEmail || !userPhone}
          >
            Reserve
          </Button>
        </div>
      )}
    </form>
  );
};

export default NormalBookingForm;
