
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CalendarIcon, Trash, Plus } from "lucide-react";
import { format } from "date-fns";
import { Apartment, BookingPeriod } from "@/types";

interface BookingPeriodCardProps {
  apartment: Apartment;
  periods: BookingPeriod[];
  onDelete: (id: string) => void;
  onAddPeriod: (apartmentId: string) => void;
}

const BookingPeriodCard: React.FC<BookingPeriodCardProps> = ({
  apartment,
  periods,
  onDelete,
  onAddPeriod,
}) => {
  return (
    <Card key={apartment.id} className="mb-6">
      <CardHeader>
        <CardTitle>{apartment.name}</CardTitle>
        <CardDescription>{apartment.location}</CardDescription>
      </CardHeader>
      <CardContent>
        {periods.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No booking periods added for this apartment.</p>
          </div>
        ) : (
          <div className="divide-y">
            {periods.map((period) => (
              <div key={period.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span>
                    {format(new Date(period.startDate), "MMM dd")} - {format(new Date(period.endDate), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${period.isBooked ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                    {period.isBooked ? "Booked" : "Available"}
                  </span>
                  {!period.isBooked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this booking period?")) {
                          onDelete(period.id);
                          toast.success("Booking period deleted successfully!");
                        }
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onAddPeriod(apartment.id)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Period for {apartment.name}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingPeriodCard;
