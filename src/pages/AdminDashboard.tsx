
import React from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import Layout from "@/components/Layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ApartmentsTab from "@/components/admin/ApartmentsTab";
import BookingPeriodsTab from "@/components/admin/BookingPeriodsTab";
import ReservationsTab from "@/components/admin/ReservationsTab";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    apartments,
    bookingPeriods,
    bookings,
    normalBookings,
    addApartment,
    updateApartment,
    deleteApartment,
    addBookingPeriod,
    deleteBookingPeriod,
    getApartmentBookingPeriods,
    userType,
  } = useBooking();

  // Redirect if not admin
  if (userType !== "admin") {
    navigate("/");
    return null;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage apartments, booking periods, and view reservations.
          </p>
        </div>

        <Tabs defaultValue="apartments">
          <TabsList className="mb-6">
            <TabsTrigger value="apartments">Apartments</TabsTrigger>
            <TabsTrigger value="booking-periods">Booking Periods</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
          </TabsList>

          {/* Apartments Tab */}
          <TabsContent value="apartments">
            <ApartmentsTab 
              apartments={apartments}
              addApartment={addApartment}
              updateApartment={updateApartment}
              deleteApartment={deleteApartment}
              getApartmentBookingPeriods={getApartmentBookingPeriods}
            />
          </TabsContent>

          {/* Booking Periods Tab */}
          <TabsContent value="booking-periods">
            <BookingPeriodsTab 
              apartments={apartments}
              bookingPeriods={bookingPeriods}
              addBookingPeriod={addBookingPeriod}
              deleteBookingPeriod={deleteBookingPeriod}
              getApartmentBookingPeriods={getApartmentBookingPeriods}
            />
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations">
            <ReservationsTab 
              bookings={bookings}
              normalBookings={normalBookings}
              apartments={apartments}
              bookingPeriods={bookingPeriods}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
