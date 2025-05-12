
import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { BookingPeriod } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { formatCurrency } from "@/utils/format";

interface PeriodBookingFormProps {
  apartmentId: string;
  apartmentPrice: number;
  availablePeriods: BookingPeriod[];
  createBooking: (booking: any) => Promise<void>;
}

const PeriodBookingForm: React.FC<PeriodBookingFormProps> = ({
  apartmentId,
  apartmentPrice,
  availablePeriods,
  createBooking
}) => {
  const navigate = useNavigate();
  const [selectedPeriodId, setSelectedPeriodId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  
  const selectedPeriod = availablePeriods.find(period => period.id === selectedPeriodId);
  
  const handleSubmitPeriodBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPeriodId || !userName || !userEmail || !userPhone) {
      toast.error("Please fill in all fields");
      return;
    }
    
    createBooking({
      periodId: selectedPeriodId,
      apartmentId: apartmentId,
      userName,
      userEmail,
      userPhone
    });
    
    toast.success("Reservation made successfully!");
    navigate("/");
  };

  const calculateNights = (startDate: Date, endDate: Date) => {
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  return (
    <form onSubmit={handleSubmitPeriodBooking} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="period" className="text-sm font-medium text-gray-700">
          Select desired period
        </label>
        <Select
          value={selectedPeriodId}
          onValueChange={setSelectedPeriodId}
        >
          <SelectTrigger id="period" className="w-full">
            <SelectValue placeholder="Choose your period" />
          </SelectTrigger>
          <SelectContent>
            {availablePeriods.length === 0 ? (
              <SelectItem value="none" disabled>
                No periods available
              </SelectItem>
            ) : (
              availablePeriods.map((period) => (
                <SelectItem key={period.id} value={period.id}>
                  {format(new Date(period.startDate), "MMM dd")} - {format(new Date(period.endDate), "MMM dd, yyyy")}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      
      {selectedPeriod && (
        <div className="bg-blue-50 p-3 rounded-md flex items-start space-x-2">
          <CalendarIcon className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <p className="font-medium text-blue-700">
              {format(new Date(selectedPeriod.startDate), "MMMM dd")} - {format(new Date(selectedPeriod.endDate), "MMMM dd, yyyy")}
            </p>
            <p className="text-sm text-blue-600">
              {calculateNights(new Date(selectedPeriod.startDate), new Date(selectedPeriod.endDate))} nights
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-4 pt-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <Input
            id="name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <Input
            id="phone"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>
      </div>
      
      {selectedPeriod && (
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">
              {formatCurrency(apartmentPrice)} DH x {calculateNights(new Date(selectedPeriod.startDate), new Date(selectedPeriod.endDate))} nights
            </span>
            <span className="font-medium">
              {formatCurrency(apartmentPrice * calculateNights(new Date(selectedPeriod.startDate), new Date(selectedPeriod.endDate)))} DH
            </span>
          </div>
         
          <div className="flex justify-between pt-3 border-t font-semibold">
            <span>Total</span>
            <span>
              {formatCurrency(
                apartmentPrice * calculateNights(new Date(selectedPeriod.startDate), new Date(selectedPeriod.endDate))
              )} DH
            </span>
          </div>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={!selectedPeriodId || !userName || !userEmail || !userPhone}
      >
        Reserve
      </Button>
    </form>
  );
};

export default PeriodBookingForm;
