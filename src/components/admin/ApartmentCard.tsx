
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Edit, Trash } from "lucide-react";
import { Apartment } from "@/types";
import ApartmentForm from "./ApartmentForm";

interface ApartmentCardProps {
  apartment: Apartment;
  onEdit: (apartment: Apartment) => void;
  onDelete: (id: string) => void;
  editingApartment: string | null;
  setEditingApartment: React.Dispatch<React.SetStateAction<string | null>>;
  apartmentForm: {
    name: string;
    location: string;
    description: string;
    price: number;
    images: string[];
    bookingType: "period" | "normal";
    minNights?: number;
    maxNights?: number;
  };
  setApartmentForm: React.Dispatch<React.SetStateAction<{
    name: string;
    location: string;
    description: string;
    price: number;
    images: string[];
    bookingType: "period" | "normal";
    minNights?: number | undefined;
    maxNights?: number | undefined;
  }>>;
  startEditing: (apartment: Apartment) => void;
  handleEditApartment: () => void;
  getApartmentBookingPeriods: (apartmentId: string) => any[];
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({
  apartment,
  onEdit,
  onDelete,
  editingApartment,
  setEditingApartment,
  apartmentForm,
  setApartmentForm,
  startEditing,
  handleEditApartment,
  getApartmentBookingPeriods
}) => {
  return (
    <Card key={apartment.id} className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 bg-gray-100">
          {apartment.images && apartment.images[0] ? (
            <img
              src={apartment.images[0]}
              alt={apartment.name}
              className="w-full h-full object-cover aspect-square md:aspect-auto"
            />
          ) : (
            <div className="w-full h-full min-h-[200px] flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <div className="md:w-3/4 p-6">
          <div className="flex justify-between">
            <h3 className="text-xl font-medium text-gray-900 mb-2">{apartment.name}</h3>
            <div className="space-x-2">
              <Dialog open={editingApartment === apartment.id} onOpenChange={(open) => {
                if (!open) setEditingApartment(null);
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => startEditing(apartment)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <ApartmentForm 
                    isEditing={true}
                    apartmentForm={apartmentForm}
                    setApartmentForm={setApartmentForm}
                    onClose={() => setEditingApartment(null)}
                    onSubmit={handleEditApartment}
                  />
                </DialogContent>
              </Dialog>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this apartment?")) {
                    onDelete(apartment.id);
                    toast.success("Apartment deleted successfully!");
                  }
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-start space-x-1 text-gray-600 text-sm mb-2">
            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{apartment.location}</span>
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">{apartment.description}</p>
          <div className="flex justify-between items-center">
            <span className="font-medium">{apartment.price} Dh par nuitée</span>
            <div className="flex flex-col items-end">
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                apartment.bookingType === 'normal' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {apartment.bookingType === 'normal' ? 'Normal booking' : 'Period booking'}
              </span>
              {apartment.bookingType === 'normal' && (
                <span className="text-xs text-gray-500 mt-1">
                  {apartment.minNights && apartment.maxNights ? 
                    `${apartment.minNights}-${apartment.maxNights} nights` : 
                    apartment.minNights ? 
                      `Min: ${apartment.minNights} nights` : 
                      apartment.maxNights ? 
                        `Max: ${apartment.maxNights} nights` : ""}
                </span>
              )}
              {apartment.bookingType === 'period' && (
                <span className="text-xs text-gray-500 mt-1">
                  {getApartmentBookingPeriods(apartment.id).filter(p => !p.isBooked).length} periods available
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ApartmentCard;
