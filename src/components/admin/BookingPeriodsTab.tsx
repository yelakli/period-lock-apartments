
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Apartment, BookingPeriod } from "@/types";
import BookingPeriodForm from "./BookingPeriodForm";
import BookingPeriodCard from "./BookingPeriodCard";

interface BookingPeriodsTabProps {
  apartments: Apartment[];
  bookingPeriods: BookingPeriod[];
  addBookingPeriod: (period: Omit<BookingPeriod, "id" | "isBooked">) => void;
  deleteBookingPeriod: (id: string) => void;
  getApartmentBookingPeriods: (apartmentId: string) => BookingPeriod[];
}

const BookingPeriodsTab: React.FC<BookingPeriodsTabProps> = ({
  apartments,
  bookingPeriods,
  addBookingPeriod,
  deleteBookingPeriod,
  getApartmentBookingPeriods,
}) => {
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);
  const [periodApartmentId, setPeriodApartmentId] = useState("");
  const [periodStartDate, setPeriodStartDate] = useState<Date | undefined>(undefined);
  const [periodEndDate, setPeriodEndDate] = useState<Date | undefined>(undefined);

  const handleAddBookingPeriod = () => {
    if (!periodApartmentId || !periodStartDate || !periodEndDate) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (periodStartDate >= periodEndDate) {
      toast.error("End date must be after start date");
      return;
    }
    
    addBookingPeriod({
      apartmentId: periodApartmentId,
      startDate: periodStartDate,
      endDate: periodEndDate,
    });
    
    setPeriodApartmentId("");
    setPeriodStartDate(undefined);
    setPeriodEndDate(undefined);
    setIsAddingPeriod(false);
  };

  const handleAddPeriodForApartment = (apartmentId: string) => {
    setPeriodApartmentId(apartmentId);
    setIsAddingPeriod(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Booking Periods</h2>
        <Dialog open={isAddingPeriod} onOpenChange={setIsAddingPeriod}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Booking Period
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <BookingPeriodForm 
              apartments={apartments}
              periodApartmentId={periodApartmentId}
              setPeriodApartmentId={setPeriodApartmentId}
              periodStartDate={periodStartDate}
              setPeriodStartDate={setPeriodStartDate}
              periodEndDate={periodEndDate}
              setPeriodEndDate={setPeriodEndDate}
              onClose={() => setIsAddingPeriod(false)}
              onSubmit={handleAddBookingPeriod}
            />
          </DialogContent>
        </Dialog>
      </div>

      {apartments.filter(apt => apt.bookingType === 'period').length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No apartments with period booking type added yet.</p>
        </div>
      ) : (
        apartments
          .filter(apt => apt.bookingType === 'period')
          .map((apartment) => {
            const periods = getApartmentBookingPeriods(apartment.id);
            
            return (
              <BookingPeriodCard 
                key={apartment.id}
                apartment={apartment}
                periods={periods}
                onDelete={deleteBookingPeriod}
                onAddPeriod={handleAddPeriodForApartment}
              />
            );
          })
      )}
    </div>
  );
};

export default BookingPeriodsTab;
