
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingDetailsFormProps {
  userName: string;
  userPhone: string;
  setUserName: (name: string) => void;
  setUserPhone: (phone: string) => void;
  isLoading: boolean;
  onSubmit?: (e: React.FormEvent) => void;
  isFormValid: boolean;
  asFormWrapper?: boolean; // New prop to control whether to wrap in form
}

const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({
  userName,
  userPhone,
  setUserName,
  setUserPhone,
  isLoading,
  onSubmit,
  isFormValid,
  asFormWrapper = true
}) => {
  const formContent = (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="userName" className="text-sm font-medium text-gray-700">
            Nom complet *
          </Label>
          <Input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Entrez votre nom complet"
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="userPhone" className="text-sm font-medium text-gray-700">
            Numéro de téléphone *
          </Label>
          <Input
            id="userPhone"
            type="tel"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            placeholder="Entrez votre numéro de téléphone"
            required
            className="mt-1"
          />
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full mt-6"
      >
        {isLoading ? "Réservation en cours..." : "Confirmer la réservation"}
      </Button>
    </>
  );

  if (asFormWrapper && onSubmit) {
    return (
      <form onSubmit={onSubmit} className="space-y-4">
        {formContent}
      </form>
    );
  }

  return <div className="space-y-4">{formContent}</div>;
};

export default BookingDetailsForm;
