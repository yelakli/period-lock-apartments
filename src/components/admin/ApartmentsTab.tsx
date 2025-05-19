
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Apartment } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import ApartmentForm from "./ApartmentForm";
import ApartmentCard from "./ApartmentCard";

interface ApartmentsTabProps {
  apartments: Apartment[];
  addApartment: (apartment: Omit<Apartment, "id">) => void;
  updateApartment: (apartment: Apartment) => void;
  deleteApartment: (id: string) => void;
  getApartmentBookingPeriods: (apartmentId: string) => any[];
}

const ApartmentsTab: React.FC<ApartmentsTabProps> = ({
  apartments,
  addApartment,
  updateApartment,
  deleteApartment,
  getApartmentBookingPeriods
}) => {
  // State for adding/editing apartments
  const [isAddingApartment, setIsAddingApartment] = useState(false);
  const [editingApartment, setEditingApartment] = useState<string | null>(null);
  const [apartmentForm, setApartmentForm] = useState({
    name: "",
    location: "",
    description: "",
    price: 0,
    images: ["", ""],
    bookingType: "period" as "period" | "normal",
    minNights: undefined as number | undefined,
    maxNights: undefined as number | undefined,
    disableBookedDates: true,
  });

  const handleAddApartment = () => {
    // Validate night constraints for normal booking
    if (apartmentForm.bookingType === "normal") {
      if (!apartmentForm.minNights && !apartmentForm.maxNights) {
        toast.error("Please specify at least one night constraint (minimum or maximum nights)");
        return;
      }
      
      if (apartmentForm.minNights && apartmentForm.maxNights && 
          apartmentForm.minNights > apartmentForm.maxNights) {
        toast.error("Minimum nights cannot be greater than maximum nights");
        return;
      }
    }
    
    addApartment({
      name: apartmentForm.name,
      location: apartmentForm.location,
      description: apartmentForm.description,
      price: Number(apartmentForm.price),
      images: apartmentForm.images.filter(Boolean),
      bookingType: apartmentForm.bookingType,
      minNights: apartmentForm.bookingType === "normal" ? apartmentForm.minNights : undefined,
      maxNights: apartmentForm.bookingType === "normal" ? apartmentForm.maxNights : undefined,
      disableBookedDates: apartmentForm.bookingType === "normal" ? apartmentForm.disableBookedDates : undefined,
    });
    
    setApartmentForm({
      name: "",
      location: "",
      description: "",
      price: 0,
      images: ["", ""],
      bookingType: "period",
      minNights: undefined,
      maxNights: undefined,
      disableBookedDates: true,
    });
    
    setIsAddingApartment(false);
  };

  const handleEditApartment = () => {
    if (editingApartment) {
      // Validate night constraints for normal booking
      if (apartmentForm.bookingType === "normal") {
        if (!apartmentForm.minNights && !apartmentForm.maxNights) {
          toast.error("Please specify at least one night constraint (minimum or maximum nights)");
          return;
        }
        
        if (apartmentForm.minNights && apartmentForm.maxNights && 
            apartmentForm.minNights > apartmentForm.maxNights) {
          toast.error("Minimum nights cannot be greater than maximum nights");
          return;
        }
      }
      
      updateApartment({
        id: editingApartment,
        name: apartmentForm.name,
        location: apartmentForm.location,
        description: apartmentForm.description,
        price: Number(apartmentForm.price),
        images: apartmentForm.images.filter(Boolean),
        bookingType: apartmentForm.bookingType,
        minNights: apartmentForm.bookingType === "normal" ? apartmentForm.minNights : undefined,
        maxNights: apartmentForm.bookingType === "normal" ? apartmentForm.maxNights : undefined,
        disableBookedDates: apartmentForm.bookingType === "normal" ? apartmentForm.disableBookedDates : undefined,
      });
      
      setEditingApartment(null);
    }
  };

  const startEditing = (apartment: Apartment) => {
    setEditingApartment(apartment.id);
    setApartmentForm({
      name: apartment.name,
      location: apartment.location,
      description: apartment.description,
      price: apartment.price,
      images: [...apartment.images, "", ""].slice(0, 2), // Ensure we have 2 image slots
      bookingType: apartment.bookingType || "period",
      minNights: apartment.minNights,
      maxNights: apartment.maxNights,
      disableBookedDates: apartment.disableBookedDates !== undefined ? apartment.disableBookedDates : true,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Apartments</h2>
        <Dialog open={isAddingApartment} onOpenChange={setIsAddingApartment}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Apartment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <ApartmentForm 
              isEditing={false}
              apartmentForm={apartmentForm}
              setApartmentForm={setApartmentForm}
              onClose={() => setIsAddingApartment(false)}
              onSubmit={handleAddApartment}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {apartments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No apartments added yet.</p>
          </div>
        ) : (
          apartments.map((apartment) => (
            <ApartmentCard 
              key={apartment.id}
              apartment={apartment}
              onEdit={updateApartment}
              onDelete={deleteApartment}
              editingApartment={editingApartment}
              setEditingApartment={setEditingApartment}
              apartmentForm={apartmentForm}
              setApartmentForm={setApartmentForm}
              startEditing={startEditing}
              handleEditApartment={handleEditApartment}
              getApartmentBookingPeriods={getApartmentBookingPeriods}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ApartmentsTab;
