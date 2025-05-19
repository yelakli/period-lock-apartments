
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BookingDetailsFormProps {
  userName: string;
  userPhone: string;
  setUserName: (name: string) => void;
  setUserPhone: (phone: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  isFormValid: boolean;
}

const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({
  userName,
  userPhone,
  setUserName,
  setUserPhone,
  isLoading,
  onSubmit,
  isFormValid,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="normalName" className="text-sm font-medium text-gray-700">
          Nom et Prénom
        </label>
        <Input
          id="normalName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Entrez votre nom et prénom"
        />
      </div>
      
      <div>
        <label htmlFor="normalPhone" className="text-sm font-medium text-gray-700">
          Numéro de Téléphone
        </label>
        <Input
          id="normalPhone"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
          placeholder="Entrez votre numéro de téléphone"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading || !isFormValid}
      >
        {isLoading ? "Traitement..." : "Réserver"}
      </Button>
    </form>
  );
};

export default BookingDetailsForm;
