
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { apartments, getAvailableBookingPeriods, normalBookings, isLoading } = useBooking();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApartments = apartments.filter(
    (apartment) =>
      apartment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apartment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apartment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Opération Estivage 2025
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Association des Oeuvres Sociales des Fonctionnaires de la Région Souss Massa
          </p>
          <p className="text-left">La saison estivale de l'année 2025 commence du 22 juin au 15 septembre 2025.</p>
          <p className="text-left">Le pourcentage de contribution du participant au processus de camping d'été a été déterminé par :</p>
          <p className="text-left">- 40 % pour les salariés classés aux grades 9 et inférieurs, avec cotisation de l'association plafonnée à 700Dh par jour.</p>
          <p className="text-left">- 50 % pour les salariés classés aux grades 10 et supérieurs, avec cotisation de l'association plafonnée à 600Dh par jour.</p>

          <p className="text-left">Très important:</p>
          <p className="text-left">- Toute réservation peut être de 4 à 5 Jours consécutifs (non séparés) pour Tafoult, Amlal, Essayadine, Essaouira, Marrakech et Martil.</p>
          <p className="text-left">- Les réservations à "CLUB EVASION" et "Résidence Beau Rivage" ne peuvent pas être inférieure à 5 jours consécutifs.</p>
          <p className="text-left">- Il n'est pas possible de réserver plus d'un appartement.</p>
          <p className="text-left">- La réservation n'est considérée comme définitive que si la contribution du participant est intégralement réglée.</p>
        </div>


        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="overflow-hidden h-full">
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <Skeleton className="w-full h-full" />
                </div>
                <CardContent className="pt-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t pt-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-28" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredApartments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No apartments found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApartments.map((apartment) => {
              const availablePeriods = apartment.bookingType === 'period' 
                ? getAvailableBookingPeriods(apartment.id)
                : [];
              
              // For normal bookings, show as available if there is at least one availability
              const hasNormalAvailability = apartment.bookingType === 'normal';
              const isAvailable = apartment.bookingType === 'period' 
                ? availablePeriods.length > 0 
                : hasNormalAvailability;
              
              return (
                <Link to={`/apartment/${apartment.id}`} key={apartment.id}>
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      {apartment.images && apartment.images[0] ? (
                        <img
                          src={apartment.images[0]}
                          alt={apartment.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400">No image available</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className={`${apartment.bookingType === 'normal' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                          {apartment.bookingType === 'normal' ? 'Réservation normale' : 'Réservation périodique'}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="text-xl font-medium text-gray-900 mb-1">{apartment.name}</h3>
                      <div className="flex items-start space-x-1 text-gray-500 text-sm mb-2">
                        <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>{apartment.location}</span>
                      </div>
                      <p className="text-gray-600 line-clamp-2">{apartment.description}</p>
                      
                      {apartment.bookingType === 'normal' && apartment.minNights && apartment.maxNights && (
                        <p className="text-sm text-gray-500 mt-2">
                          {apartment.minNights === apartment.maxNights 
                            ? `${apartment.minNights} nuitées requises` 
                            : `${apartment.minNights}-${apartment.maxNights} nuitées restantes`}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t pt-4">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(apartment.price)} <span className="text-sm font-normal text-gray-500">Dh/nuitée</span>
                      </div>
                      <Badge variant={isAvailable ? "outline" : "secondary"}>
                        {apartment.bookingType === 'period' ? (
                          availablePeriods.length > 0
                            ? `${availablePeriods.length} Period${availablePeriods.length === 1 ? "" : "s"} Available`
                            : "Aucune période disponible"
                        ) : (
                          "Check Availability"
                        )}
                      </Badge>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
