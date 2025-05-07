
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import HeroCarousel from "@/components/HeroCarousel";

const Index = () => {
  const { apartments, getAvailableBookingPeriods } = useBooking();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApartments = apartments.filter(
    (apartment) =>
      apartment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apartment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apartment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const heroSlides = [
    {
      title: "Prolongation délai dépôt",
      description: "Prolongation du délai de dépôt des dossiers de candidature aux instances consultatives de la Région Souss Massa",
      buttonText: "Détails",
      buttonLink: "#",
      background: "linear-gradient(45deg, #4568dc, #b06ab3)"
    },
    {
      title: "Special Offers",
      description: "Check out our special offers this month. Book now for exclusive discounts on select apartments",
      buttonText: "Learn More",
      buttonLink: "#specials",
      background: "linear-gradient(45deg, #ff9966, #ff5e62)"
    },
    {
      title: "Luxury Apartments",
      description: "Discover our collection of premium apartments with stunning views and top amenities",
      buttonText: "View Luxury Collection",
      buttonLink: "#luxury",
      background: "linear-gradient(45deg, #457fca, #5691c8)"
    },
    {
      title: "New Properties Added",
      description: "We've just added new properties in popular neighborhoods. Be the first to check them out",
      buttonText: "See New Listings",
      buttonLink: "#new",
      background: "linear-gradient(45deg, #2c3e50, #4ca1af)"
    },
    {
      title: "Customer Reviews",
      description: "See what our happy customers are saying about their stay in our apartments",
      buttonText: "Read Reviews",
      buttonLink: "#reviews",
      background: "linear-gradient(45deg, #5f2c82, #49a09d)"
    }
  ];

  return (
    <Layout>
      <div className="max-w-full mx-auto">
        <HeroCarousel slides={heroSlides} />
        
        <div className="max-w-6xl mx-auto px-4 mt-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Actualités
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our selection of apartments and find the perfect place for your next trip.
              Book with confidence and enjoy your stay.
            </p>
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

          {filteredApartments.length === 0 ? (
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
                          ${formatCurrency(apartment.price)} <span className="text-sm font-normal text-gray-500">/ night</span>
                        </div>
                        <Badge variant={availablePeriods.length > 0 ? "outline" : "secondary"}>
                          {availablePeriods.length > 0
                            ? `${availablePeriods.length} period${availablePeriods.length === 1 ? "" : "s"} available`
                            : "Fully booked"}
                        </Badge>
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
