
import React from "react";
import { format, isSameDay } from "date-fns";
import { fr } from 'date-fns/locale';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  isLoadingDates: boolean;
  bookedDates: Date[];
  minNights?: number;
  maxNights?: number;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateSelect,
  isLoadingDates,
  bookedDates,
  minNights,
  maxNights,
}) => {

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

  return (
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
              onSelect={onDateSelect}
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
  );
};

export default DateRangePicker;
