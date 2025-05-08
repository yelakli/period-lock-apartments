
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBooking } from "@/context/BookingContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/format";

const ApartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { apartments, getAvailableBookingPeriods, createBooking } = useBooking();
  
  const apartment = apartments.find((a) => a.id === id);
  const availablePeriods = getAvailableBookingPeriods(id || "");

  const [selectedPeriodId, setSelectedPeriodId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  
  const selectedPeriod = availablePeriods.find(period => period.id === selectedPeriodId);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPeriodId || !userName || !userEmail || !userPhone) {
      toast.error("Remplissez les champs svp !");
      return;
    }
    
    createBooking({
      periodId: selectedPeriodId,
      apartmentId: id || "",
      userName,
      userEmail,
      userPhone
    });
    
    toast.success("Réservation effectuée avec succès!");
    navigate("/");
  };
  
  if (!apartment) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Aucun appartement trouvé</h2>
          <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{apartment.name}</h1>
            
            <div className="flex items-start space-x-1 text-gray-600 mb-6">
              <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{apartment.location}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {apartment.images && apartment.images.length > 0 ? (
                apartment.images.map((image, index) => (
                  <div key={index} className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={image}
                      alt={`${apartment.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-400">No images available</span>
                </div>
              )}
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About this place</h2>
              <p className="text-gray-600 whitespace-pre-line">{apartment.description}</p>
            </div>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-baseline justify-between mb-4">
                  <div className="text-2xl font-semibold">{formatCurrency(apartment.price)} Dh</div>
                  <div className="text-sm text-gray-500">per night</div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="period" className="text-sm font-medium text-gray-700">
                      Sélectionnez la période souhaitée
                    </label>
                    <Select
                      value={selectedPeriodId}
                      onValueChange={setSelectedPeriodId}
                    >
                      <SelectTrigger id="period" className="w-full">
                        <SelectValue placeholder="Choose period" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePeriods.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No periods available
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
                  
                  {selectedPeriod && (
                    <div className="bg-blue-50 p-3 rounded-md flex items-start space-x-2">
                      <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-700">
                          {format(new Date(selectedPeriod.startDate), "MMMM dd")} - {format(new Date(selectedPeriod.endDate), "MMMM dd, yyyy")}
                        </p>
                        <p className="text-sm text-blue-600">
                          {Math.round((new Date(selectedPeriod.endDate).getTime() - new Date(selectedPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24))} nights
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4 pt-2">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Nom Complet
                      </label>
                      <Input
                        id="Nom et Prénom"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Entrez votre nom complet"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="Entrez votre email"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Numéro de Téléphone (facultatif)
                      </label>
                      <Input
                        id="phone"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="Entrez votre numéro de téléphone "
                      />
                    </div>
                  </div>
                  
                  {selectedPeriod && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">{formatCurrency(apartment.price)} x {Math.round((new Date(selectedPeriod.endDate).getTime() - new Date(selectedPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24))} Dh nuitées</span>
                        <span className="font-medium">
                          {formatCurrency(apartment.price * Math.round((new Date(selectedPeriod.endDate).getTime() - new Date(selectedPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24)))} Dh
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Service fee</span>
                        <span className="font-medium">{formatCurrency(apartment.price * 0.1)} Dh</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t font-semibold">
                        <span>Total</span>
                        <span>
                          {formatCurrency(
                            apartment.price * Math.round((new Date(selectedPeriod.endDate).getTime() - new Date(selectedPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24)) + apartment.price * 0.1
                          )} Dh
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!selectedPeriodId || !userName || !userEmail || !userPhone}
                  >
                    Reserve
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApartmentDetails;
