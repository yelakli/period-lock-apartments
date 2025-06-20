
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import PeriodBookingForm from "@/components/booking/PeriodBookingForm";
import NormalBookingForm from "@/components/booking/NormalBookingForm";
import ApartmentInfo from "@/components/apartment/ApartmentInfo";

const ApartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    apartments, 
    getAvailableBookingPeriods, 
    createBooking,
    createNormalBooking,
    isNormalDateRangeAvailable,
    getBookedDatesForApartment,
    isAdminLoggedIn
  } = useBooking();
  
  const apartment = apartments.find((a) => a.id === id);
  const availablePeriods = apartment ? getAvailableBookingPeriods(id || "") : [];

  if (!apartment) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Apartment not found</h2>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ApartmentInfo 
              apartment={apartment} 
              isAdminLoggedIn={isAdminLoggedIn} 
            />
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-baseline justify-between mb-4">
                  <div className="text-2xl font-semibold">{formatCurrency(apartment.price)} DH</div>
                  <div className="text-sm text-gray-500">par nuitée</div>
                </div>
                <div className="flex items-baseline justify-between mb-4">
                  <div className="text-sm text-500" style="color:orange;">N.B : Le prix de la nuitée peut varier selon la période de réservation. Voir la description de l'appartement pour plus de détail.</div>
                </div>
                
                {/* Period Booking Form */}
                {apartment.bookingType === "period" && (
                  <PeriodBookingForm
                    apartmentId={id || ""}
                    apartmentPrice={apartment.price}
                    availablePeriods={availablePeriods}
                    createBooking={createBooking}
                  />
                )}
                
                {/* Normal Booking Form */}
                {apartment.bookingType === "normal" && (
                  <NormalBookingForm
                    apartmentId={id || ""}
                    apartmentPrice={apartment.price}
                    minNights={apartment.minNights}
                    maxNights={apartment.maxNights}
                    isNormalDateRangeAvailable={isNormalDateRangeAvailable}
                    getBookedDatesForApartment={getBookedDatesForApartment}
                    createNormalBooking={createNormalBooking}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApartmentDetails;
