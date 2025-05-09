
import React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Apartment } from "@/types";

interface BookingPeriodFormProps {
  apartments: Apartment[];
  periodApartmentId: string;
  setPeriodApartmentId: React.Dispatch<React.SetStateAction<string>>;
  periodStartDate: Date | undefined;
  setPeriodStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  periodEndDate: Date | undefined;
  setPeriodEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  onClose: () => void;
  onSubmit: () => void;
}

const BookingPeriodForm: React.FC<BookingPeriodFormProps> = ({
  apartments,
  periodApartmentId,
  setPeriodApartmentId,
  periodStartDate,
  setPeriodStartDate,
  periodEndDate,
  setPeriodEndDate,
  onClose,
  onSubmit
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Add New Booking Period</DialogTitle>
        <DialogDescription>
          Set available dates for an apartment.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Select Apartment
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={periodApartmentId}
            onChange={(e) => setPeriodApartmentId(e.target.value)}
          >
            <option value="">Select an apartment</option>
            {apartments
              .filter(apt => apt.bookingType === 'period')
              .map((apt) => (
                <option key={apt.id} value={apt.id}>
                  {apt.name} - {apt.bookingType === 'period' ? 'Period booking' : 'Normal booking'}
                </option>
              ))}
          </select>
          {periodApartmentId && apartments.find(apt => apt.id === periodApartmentId)?.bookingType !== 'period' && (
            <p className="text-red-500 text-sm mt-1">
              Periods can only be added to apartments with "Period booking" type.
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Start Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !periodStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {periodStartDate ? format(periodStartDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={periodStartDate}
                  onSelect={setPeriodStartDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              End Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !periodEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {periodEndDate ? format(periodEndDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={periodEndDate}
                  onSelect={setPeriodEndDate}
                  initialFocus
                  disabled={(date) => periodStartDate ? date < periodStartDate : false}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!periodApartmentId || apartments.find(apt => apt.id === periodApartmentId)?.bookingType !== 'period'}>
          Add Period
        </Button>
      </DialogFooter>
    </>
  );
};

export default BookingPeriodForm;
