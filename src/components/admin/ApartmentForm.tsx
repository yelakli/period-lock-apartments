
import React from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Apartment } from "@/types";

interface ApartmentFormProps {
  isEditing: boolean;
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
  onClose: () => void;
  onSubmit: () => void;
}

const ApartmentForm: React.FC<ApartmentFormProps> = ({
  isEditing,
  apartmentForm,
  setApartmentForm,
  onClose,
  onSubmit,
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Apartment" : "Add New Apartment"}</DialogTitle>
        {!isEditing && (
          <DialogDescription>
            Enter the details for the new apartment listing.
          </DialogDescription>
        )}
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
            Apartment Name
          </label>
          <Input
            id="name"
            value={apartmentForm.name}
            onChange={(e) => setApartmentForm({ ...apartmentForm, name: e.target.value })}
            placeholder="Enter apartment name"
          />
        </div>
        <div>
          <label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1 block">
            Location
          </label>
          <Input
            id="location"
            value={apartmentForm.location}
            onChange={(e) => setApartmentForm({ ...apartmentForm, location: e.target.value })}
            placeholder="Enter location"
          />
        </div>
        <div>
          <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1 block">
            Description
          </label>
          <Textarea
            id="description"
            value={apartmentForm.description}
            onChange={(e) => setApartmentForm({ ...apartmentForm, description: e.target.value })}
            placeholder="Enter apartment description"
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="price" className="text-sm font-medium text-gray-700 mb-1 block">
            Price per Night (Dh)
          </label>
          <Input
            id="price"
            type="number"
            value={apartmentForm.price || ""}
            onChange={(e) => setApartmentForm({ ...apartmentForm, price: parseFloat(e.target.value) || 0 })}
            placeholder="Enter price per night"
            min="0"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Booking Type
          </label>
          <RadioGroup 
            value={apartmentForm.bookingType} 
            onValueChange={(value: "period" | "normal") => 
              setApartmentForm({ ...apartmentForm, bookingType: value })
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="period" id={`${isEditing ? 'edit-' : ''}period`} />
              <label htmlFor={`${isEditing ? 'edit-' : ''}period`} className="text-sm">Period-based booking</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id={`${isEditing ? 'edit-' : ''}normal`} />
              <label htmlFor={`${isEditing ? 'edit-' : ''}normal`} className="text-sm">Normal date range booking</label>
            </div>
          </RadioGroup>
        </div>
        
        {apartmentForm.bookingType === "normal" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${isEditing ? 'edit-' : ''}minNights`} className="text-sm font-medium text-gray-700 mb-1 block">
                Minimum Nights
              </label>
              <Input
                id={`${isEditing ? 'edit-' : ''}minNights`}
                type="number"
                value={apartmentForm.minNights ?? ""}
                onChange={(e) => setApartmentForm({ 
                  ...apartmentForm, 
                  minNights: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                placeholder="Min nights"
                min="1"
              />
            </div>
            <div>
              <label htmlFor={`${isEditing ? 'edit-' : ''}maxNights`} className="text-sm font-medium text-gray-700 mb-1 block">
                Maximum Nights
              </label>
              <Input
                id={`${isEditing ? 'edit-' : ''}maxNights`}
                type="number"
                value={apartmentForm.maxNights ?? ""}
                onChange={(e) => setApartmentForm({ 
                  ...apartmentForm, 
                  maxNights: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                placeholder="Max nights"
                min="1"
              />
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor={`${isEditing ? 'edit-' : ''}images`} className="text-sm font-medium text-gray-700 mb-1 block">
            Image URLs {!isEditing && "(optional)"}
          </label>
          <div className="grid gap-2">
            <Input
              value={apartmentForm.images[0] || ""}
              onChange={(e) => setApartmentForm({
                ...apartmentForm,
                images: [e.target.value, apartmentForm.images[1] || ""]
              })}
              placeholder="Enter image URL #1"
            />
            <Input
              value={apartmentForm.images[1] || ""}
              onChange={(e) => setApartmentForm({
                ...apartmentForm,
                images: [apartmentForm.images[0] || "", e.target.value]
              })}
              placeholder="Enter image URL #2"
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {isEditing ? "Save Changes" : "Save Apartment"}
        </Button>
      </DialogFooter>
    </>
  );
};

export default ApartmentForm;
