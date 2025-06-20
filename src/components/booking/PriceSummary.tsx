
import React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { formatCurrency } from "@/utils/format";

interface PriceSummaryProps {
  startDate: Date;
  endDate: Date;
  nightsCount: number;
  apartmentPrice: number;
  totalPrice: number;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({
  startDate,
  endDate,
  nightsCount,
  apartmentPrice,
  totalPrice,
}) => {
  return (
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
          <span className="font-medium">
            Vous avez sélectionné {nightsCount} nuitées à réserver.
          </span>
        </div>
        <div className="flex justify-between pt-3 border-t font-semibold">
          <span></span>
          <span></span>
        </div>
        
      </div>
    </>
  );
};

export default PriceSummary;

        
       
       
      