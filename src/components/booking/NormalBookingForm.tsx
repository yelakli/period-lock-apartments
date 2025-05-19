
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { differenceInDays, isSameDay } from "date-fns";
import { toast } from "sonner";
import { Apartment } from "@/types";
import DateRangePicker from "./DateRangePicker";
import PriceSummary from "./PriceSummary";
import BookingDetailsForm from "./BookingDetailsForm";

interface NormalBookingFormProps {
  apartmentId: string;
  apartmentPrice: number;
  minNights?: number;
  maxNights?: number;
  isNormalDateRangeAvailable: (apartmentId: string, startDate: Date, endDate: Date) => Promise<boolean>;
  getBookedDatesForApartment: (apartmentId: string) => Promise<Date[]>;
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
  getBookedDatesForApartment,
  createNormalBooking
}) => {
  const navigate = useNavigate();
  
  // State for normal booking
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(true);
  
  // Calculate the number of nights for normal booking
  const nightsCount = startDate && endDate ? 
    differenceInDays(new Date(endDate), new Date(startDate)) : 0;

  // Calculate the total price for normal booking
  const totalPrice = apartmentPrice && nightsCount ? apartmentPrice * nightsCount : 0;

  // Load booked dates when component mounts
  useEffect(() => {
    const loadBookedDates = async () => {
      setIsLoadingDates(true);
      try {
        const dates = await getBookedDatesForApartment(apartmentId);
        setBookedDates(dates);
      } catch (error) {
        console.error("Failed to load booked dates:", error);
        toast.error("Failed to load availability information");
      } finally {
        setIsLoadingDates(false);
      }
    };

    loadBookedDates();
  }, [apartmentId, getBookedDatesForApartment]);
  
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (!startDate || (startDate && endDate)) {
      // If no start date is selected or both dates are selected, set the new date as the start date
      setStartDate(date);
      setEndDate(undefined);
    } else {
      // If only the start date is selected and the new date is after the start date
      if (date > startDate) {
        // Check if the selected range includes any disabled dates
        let containsDisabledDate = false;
        let currentDate = new Date(startDate);
        
        while (currentDate <= date) {
          if (isDayDisabled(currentDate) && !isSameDay(currentDate, startDate)) {
            containsDisabledDate = true;
            break;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        if (containsDisabledDate) {
          toast.error("Votre période sélectionnée inclut des dates déjà réservées");
          return;
        }
        
        // Calculate nights between selected dates
        const nights = differenceInDays(date, startDate);
        
        // Check min/max night constraints
        if (minNights && nights < minNights) {
          toast.error(`Minimum réservation ${minNights} nuitées`);
          return;
        }
        
        if (maxNights && nights > maxNights) {
          toast.error(`Maximum réservation ${maxNights} nuitées`);
          return;
        }
        
        setEndDate(date);
      } else {
        // If the new date is before or equal to the start date, update the start date
        setStartDate(date);
        setEndDate(undefined);
      }
    }
  };
  
  const isDayDisabled = (date: Date) => {
    // Disable dates in the past
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      return true;
    }
    
    // Disable already booked dates
    return bookedDates.some(bookedDate => 
      isSameDay(new Date(bookedDate), date)
    );
  };
  
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !userName || !userPhone) {
      toast.error("Remplissez tous les champs !");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await createNormalBooking({
        apartmentId: apartmentId,
        userName,
        userPhone,
        startDate,
        endDate
      });
      
      if (result.success) {
        toast.success("Réservation effectuée avec succès!");
        
        // Update booked dates after successful booking
        const updatedBookedDates = [...bookedDates];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          updatedBookedDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        setBookedDates(updatedBookedDates);
        
        // Reset form states
        setStartDate(undefined);
        setEndDate(undefined);
        setUserName("");
        setUserPhone("");
        
        navigate("/");
      } else {
        toast.error("Échec de la création de la réservation. Veuillez réessayer.");
        console.error("Booking creation failed:", result.error);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Une erreur s'est produite lors de votre réservation.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is valid for submission
  const isFormValid = !!(startDate && endDate && userName && userPhone);

  return (
    <div className="space-y-4">
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onDateSelect={handleDateSelect}
        isLoadingDates={isLoadingDates}
        bookedDates={bookedDates}
        minNights={minNights}
        maxNights={maxNights}
      />
      
      {startDate && endDate && (
        <>
          <PriceSummary
            startDate={startDate}
            endDate={endDate}
            nightsCount={nightsCount}
            apartmentPrice={apartmentPrice}
            totalPrice={totalPrice}
          />
          
          <div className="space-y-4 pt-2">
            <BookingDetailsForm
              userName={userName}
              userPhone={userPhone}
              setUserName={setUserName}
              setUserPhone={setUserPhone}
              isLoading={isLoading}
              onSubmit={handleSubmitBooking}
              isFormValid={isFormValid}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default NormalBookingForm;
