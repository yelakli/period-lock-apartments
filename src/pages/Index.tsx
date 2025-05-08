
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import { useLanguage } from "@/context/LanguageContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { formatAsCurrency } from "@/utils/format";

const Index = () => {
  const { apartments, getAvailableBookingPeriods } = useBooking();
  const { translate } = useLanguage();
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
            {translate("find_your_perfect_stay")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {translate("browse_selection")}
          </p>
        </div>

        <div className="mb-8">
          <Input
            type="text"
            placeholder={translate("search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-lg mx-auto"
          />
        </div>

        {filteredApartments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{translate("no_apartments")}</p>
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
                        {formatAsCurrency(apartment.price)} <span className="text-sm font-normal text-gray-500">/ {translate("night")}</span>
                      </div>
                      <Badge variant={availablePeriods.length > 0 ? "outline" : "secondary"}>
                        {availablePeriods.length > 0
                          ? `${availablePeriods.length} ${availablePeriods.length === 1 
                              ? translate("periods_available") 
                              : translate("periods_available_plural")}`
                          : translate("fully_booked")}
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
