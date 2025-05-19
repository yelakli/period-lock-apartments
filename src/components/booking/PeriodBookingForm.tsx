
import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { BookingPeriod } from "@/types";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import PeriodSelector from "./PeriodSelector";
import PriceSummary from "./PriceSummary";
import BookingDetailsForm from "./BookingDetailsForm";

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
  const [userPhone, setUserPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const selectedPeriod = availablePeriods.find(period => period.id === selectedPeriodId);
  
  const calculateNights = (startDate: Date, endDate: Date) => {
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleSubmitPeriodBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPeriodId || !userName || !userPhone) {
      toast.error("Remplissez tous les champs !");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await createBooking({
        periodId: selectedPeriodId,
        apartmentId: apartmentId,
        userName,
        userPhone
      });
      
      toast.success("Reservation made successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Une erreur s'est produite lors de votre réservation.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is valid for submission
  const isFormValid = !!(selectedPeriodId && userName && userPhone);

  // Calculate pricing information if a period is selected
  let nightsCount = 0;
  let totalPrice = 0;
  
  if (selectedPeriod) {
    nightsCount = calculateNights(new Date(selectedPeriod.startDate), new Date(selectedPeriod.endDate));
    totalPrice = apartmentPrice * nightsCount;
  }
  
  return (
    <form onSubmit={handleSubmitPeriodBooking} className="space-y-4">
      <PeriodSelector
        availablePeriods={availablePeriods}
        selectedPeriodId={selectedPeriodId}
        setSelectedPeriodId={setSelectedPeriodId}
      />
      
      {selectedPeriod && (
        <div className="bg-blue-50 p-3 rounded-md flex items-start space-x-2">
          <CalendarIcon className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <p className="font-medium text-blue-700">
              {format(new Date(selectedPeriod.startDate), "MMMM dd")} - {format(new Date(selectedPeriod.endDate), "MMMM dd, yyyy")}
            </p>
            <p className="text-sm text-blue-600">
              {nightsCount} nuitées
            </p>
          </div>
        </div>
      )}
      
      {selectedPeriod && (
        <PriceSummary
          startDate={new Date(selectedPeriod.startDate)}
          endDate={new Date(selectedPeriod.endDate)}
          nightsCount={nightsCount}
          apartmentPrice={apartmentPrice}
          totalPrice={totalPrice}
        />
      )}
      
      <BookingDetailsForm
        userName={userName}
        userPhone={userPhone}
        setUserName={setUserName}
        setUserPhone={setUserPhone}
        isLoading={isLoading}
        onSubmit={handleSubmitPeriodBooking}
        isFormValid={isFormValid}
      />
    </form>
  );
};

export default PeriodBookingForm;
