
import React from "react";
import { Booking, Apartment, BookingPeriod, NormalBooking } from "@/types";
import ReservationsTable from "@/components/ReservationsTable";

interface ReservationsTabProps {
  bookings: Booking[];
  normalBookings: NormalBooking[];
  apartments: Apartment[];
  bookingPeriods: BookingPeriod[];
}

const ReservationsTab: React.FC<ReservationsTabProps> = ({
  bookings,
  normalBookings,
  apartments,
  bookingPeriods,
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Manage Reservations</h2>

      {bookings.length === 0 && normalBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No reservations have been made yet.</p>
        </div>
      ) : (
        <ReservationsTable 
          bookings={bookings}
          normalBookings={normalBookings}
          apartments={apartments}
          bookingPeriods={bookingPeriods}
        />
      )}
    </div>
  );
};

export default ReservationsTab;
