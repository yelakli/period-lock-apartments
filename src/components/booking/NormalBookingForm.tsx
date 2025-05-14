
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, differenceInDays, isSameDay } from "date-fns";
import { fr } from 'date-fns/locale';
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
  
  const handleSubmitNormalBooking = async (e: React.FormEvent) => {
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

  return (
    <form onSubmit={handleSubmitNormalBooking} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Séléctionnez votre réservation
        </label>
        <div className="text-xs text-gray-500 mb-2">
          {minNights && maxNights ? 
            `Min: ${minNights} nuitées | Max: ${maxNights} nuitées` : 
            minNights ? 
              `Min: ${minNights} nuitées` : 
              maxNights ? 
                `Max: ${maxNights} nuitées` : ""}
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
                    {format(startDate, "dd MMM yyyy", { locale: fr })} - {format(endDate, "dd MMM yyyy", { locale: fr })}
                  </>
                ) : (
                  format(startDate, "dd MMM yyyy", { locale: fr })
                )
              ) : (
                <span>Sélectionnez des dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            {isLoadingDates ? (
              <div className="p-4 text-center">Chargement des dates disponibles...</div>
            ) : (
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleDateSelect}
                initialFocus
                disabled={isDayDisabled}
                className={cn("p-3 pointer-events-auto")}
                locale={fr}
              />
            )}
            {startDate && !endDate && (
              <div className="px-4 py-2 border-t text-sm text-muted-foreground">
                Séléctionnez la date de sortie
              </div>
            )}
          </PopoverContent>
        </Popover>
        {bookedDates.length > 0 && (
          <div className="text-xs text-amber-600">
            Note: Si vous ne pouvez pas sélectionner une date celà veut dire qu'elle est déjà réservée.<br></br>
            Veuillez sélectionnez la date d'entrée et la date de sortie.<br></br>
            5 nuitées = 6 jours (ex : Du 01/07/2025 au 06/07/2025)<br></br>
            ملاحظة : إذا لم تتمكن من اختيار تاريخ، فهذا يعني أنه تم حجزه مسبقا<br></br>
             يرجى اختيار تاريخ الدخول وتاريخ الخروج<br></br>
              nuitées 5 = أيام 6 (مثال: من 01/07/2025 إلى 06/07/2025)
          </div>
        )}
      </div>
      
      {startDate && endDate && (
        <>
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex items-start space-x-2">
              <CalendarIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-blue-700">
                  {format(startDate, "d MMMM", { locale: fr })} - {format(endDate, "d MMMM yyyy", { locale: fr })}
                </p>
                <p className="text-sm text-blue-600">
                  {nightsCount} nuitées
                </p>
              </div>
            </div>
            
            <div className="mt-2 text-center text-sm text-green-600">
              ✓ Réservation disponible
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">
                {formatCurrency(apartmentPrice)} DH x {nightsCount} nuitées
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
          
          <div className="space-y-4 pt-2">
            <div>
              <label htmlFor="normalName" className="text-sm font-medium text-gray-700">
                Nom et Prénom
              </label>
              <Input
                id="normalName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Entrez votre nom et prénom"
              />
            </div>
            
            
            <div>
              <label htmlFor="normalPhone" className="text-sm font-medium text-gray-700">
                Numéro de Téléphone
              </label>
              <Input
                id="normalPhone"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="Entrez votre numéro de téléphone"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !startDate || !endDate || !userName || !userPhone}
            >
              {isLoading ? "Traitement..." : "Réserver"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default NormalBookingForm;
