
import { useMemo } from "react";
import { format } from "date-fns";
import { Booking, NormalBooking, Apartment, BookingPeriod } from "@/types";

export const useBookingsData = (
  bookings: Booking[],
  normalBookings: NormalBooking[],
  apartments: Apartment[],
  bookingPeriods: BookingPeriod[],
  searchTerm: string
) => {
  // Filter period bookings based on search term
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const apartment = apartments.find((a) => a.id === booking.apartmentId);
      const period = bookingPeriods.find((p) => p.id === booking.periodId);
      
      if (!apartment || !period) return false;
      
      const searchString = `${booking.userName} ${booking.userEmail || ""} ${
        booking.userPhone || ""
      } ${apartment.name} ${apartment.location}`.toLowerCase();
      
      return searchString.includes(searchTerm.toLowerCase());
    });
  }, [bookings, apartments, bookingPeriods, searchTerm]);

  // Filter normal bookings based on search term
  const filteredNormalBookings = useMemo(() => {
    return normalBookings.filter((booking) => {
      const apartment = apartments.find((a) => a.id === booking.apartmentId);
      
      if (!apartment) return false;
      
      const searchString = `${booking.userName} ${booking.userEmail || ""} ${
        booking.userPhone || ""
      } ${apartment.name} ${apartment.location}`.toLowerCase();
      
      return searchString.includes(searchTerm.toLowerCase());
    });
  }, [normalBookings, apartments, searchTerm]);

  // Transform period bookings data for display
  const periodBookingsData = useMemo(() => {
    return filteredBookings.map((booking) => {
      const apartment = apartments.find((a) => a.id === booking.apartmentId);
      const period = bookingPeriods.find((p) => p.id === booking.periodId);
      
      if (!apartment || !period) return null;
      
      const nights = Math.round(
        (new Date(period.endDate).getTime() - new Date(period.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      
      return {
        id: booking.id,
        userName: booking.userName,
        userEmail: booking.userEmail || "N/A",
        userPhone: booking.userPhone || "N/A",
        apartmentName: apartment.name,
        apartmentLocation: apartment.location,
        startDate: format(new Date(period.startDate), "MMM dd, yyyy"),
        endDate: format(new Date(period.endDate), "MMM dd, yyyy"),
        nights: nights,
        bookingDate: format(new Date(booking.bookingDate), "MMM dd, yyyy HH:mm:ss"),
        totalAmount: apartment.price * nights,
      };
    }).filter(Boolean);
  }, [filteredBookings, apartments, bookingPeriods]);

  // Transform normal bookings data for display
  const normalBookingsData = useMemo(() => {
    return filteredNormalBookings.map((booking) => {
      const apartment = apartments.find((a) => a.id === booking.apartmentId);
      
      if (!apartment) return null;
      
      const nights = Math.round(
        (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      
      return {
        id: booking.id,
        userName: booking.userName,
        userEmail: booking.userEmail || "N/A",
        userPhone: booking.userPhone || "N/A",
        apartmentName: apartment.name,
        apartmentLocation: apartment.location,
        startDate: format(new Date(booking.startDate), "MMM dd, yyyy"),
        endDate: format(new Date(booking.endDate), "MMM dd, yyyy"),
        nights: nights,
        bookingDate: format(new Date(booking.bookingDate), "MMM dd, yyyy HH:mm:ss"),
        totalAmount: apartment.price * nights,
      };
    }).filter(Boolean);
  }, [filteredNormalBookings, apartments]);

  return {
    filteredBookings,
    filteredNormalBookings,
    periodBookingsData,
    normalBookingsData
  };
};
