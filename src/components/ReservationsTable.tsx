
import React from "react";
import { Booking, Apartment, BookingPeriod, NormalBooking } from "@/types";
import ReservationsTable from "./reservations/ReservationsTable";

interface ReservationsTableProps {
  bookings: Booking[];
  normalBookings: NormalBooking[];
  apartments: Apartment[];
  bookingPeriods: BookingPeriod[];
}

// This is a wrapper around our new component structure to maintain backward compatibility
const ReservationsTableWrapper: React.FC<ReservationsTableProps> = (props) => {
  return <ReservationsTable {...props} />;
};

export default ReservationsTableWrapper;
