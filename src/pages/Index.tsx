
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
  const { apartments, getAvailableBookingPeriods, isLoading } = useBooking();
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
          <p className="text">La saison estivale de l'année 2024 commence du 22 juin au 15 septembre 2024.</p>
          <p className="text">Le pourcentage de contribution du participant au processus de camping d'été a été déterminé par :</p>
          <p className="text">- 25 % pour les salariés classés aux grades 9 et inférieurs, avec cotisation de l'association plafonnée à 700Dh par jour.</p>
          <p className="text">- 35 % pour les salariés classés aux grades 10 et supérieurs, avec cotisation de l'association plafonnée à 600Dh par jour.</p>

          <p className="text text-gray-600 max-w-2xl mx-auto">Très important:</p>
          <p className="text text-gray-600 max-w-2xl mx-auto">- Toute réservation peut être de 4 à 5 Jours consécutifs (non séparés) pour Tafoult, Amlal, Essayadine, Essaouira, Marrakech et Martil.</p>
          <p className="text text-gray-600 max-w-2xl mx-auto">- Les réservations à "CLUB EVASION" et "Résidence Beau Rivage" ne peuvent pas être inférieure à 5 jours consécutifs.</p>
          <p className="text text-gray-600 max-w-2xl mx-auto">- Il n'est pas possible de réserver plus d'un appartement.</p>
          <p className="text text-gray-600 max-w-2xl mx-auto">- La réservation n’est considérée comme définitive que si la contribution du participant est intégralement réglée.</p>
        </div>

        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search apartments by name, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-lg mx-auto"
          />
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
              const availablePeriods = getAvailableBookingPeriods(apartment.id);
              
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
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="text-xl font-medium text-gray-900 mb-1">{apartment.name}</h3>
                      <div className="flex items-start space-x-1 text-gray-500 text-sm mb-2">
                        <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>{apartment.location}</span>
                      </div>
                      <p className="text-gray-600 line-clamp-2">{apartment.description}</p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t pt-4">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(apartment.price)} <span className="text-sm font-normal text-gray-500"> Dh/ nuitée</span>
                      </div>
                      <Badge variant={availablePeriods.length > 0 ? "outline" : "secondary"}>
                        {availablePeriods.length > 0
                          ? `${availablePeriods.length} Période${availablePeriods.length === 1 ? "" : "s"} Disponible`
                          : "Réservations Complètes"}
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
