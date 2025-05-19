
import React from "react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingPeriod } from "@/types";

interface PeriodSelectorProps {
  availablePeriods: BookingPeriod[];
  selectedPeriodId: string;
  setSelectedPeriodId: (id: string) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  availablePeriods,
  selectedPeriodId,
  setSelectedPeriodId,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor="period" className="text-sm font-medium text-gray-700">
        Selectionnez la période désirée
      </label>
      <Select
        value={selectedPeriodId}
        onValueChange={setSelectedPeriodId}
      >
        <SelectTrigger id="period" className="w-full">
          <SelectValue placeholder="Choisissez votre période" />
        </SelectTrigger>
        <SelectContent>
          {availablePeriods.length === 0 ? (
            <SelectItem value="none" disabled>
              Aucune période disponible
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
  );
};

export default PeriodSelector;
