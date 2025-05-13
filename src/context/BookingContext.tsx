
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Apartment, BookingPeriod, Booking, NormalBooking } from "@/types";
import { BookingContextType } from "./BookingContextTypes";
import { useApartmentManagement } from "./hooks/useApartmentManagement";
import { useBookingPeriodManagement } from "./hooks/useBookingPeriodManagement";
import { useBookingManagement } from "./hooks/useBookingManagement";
import { useAuthManagement } from "./hooks/useAuthManagement";

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [bookingPeriods, setBookingPeriods] = useState<BookingPeriod[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [normalBookings, setNormalBookings] = useState<NormalBooking[]>([]);

  // Initialize hooks
  const { 
    isAdminLoggedIn, 
    userType, 
    setUserType, 
    checkSession,
    adminLogin, 
    adminLogout 
  } = useAuthManagement();

  const { 
    isLoading,
    fetchApartments,
    addApartment,
    updateApartment,
    deleteApartment
  } = useApartmentManagement(apartments, setApartments, bookingPeriods, setBookingPeriods, bookings, setBookings);

  const { 
    fetchBookingPeriods,
    addBookingPeriod,
    deleteBookingPeriod,
    getApartmentBookingPeriods,
    getAvailableBookingPeriods
  } = useBookingPeriodManagement(bookingPeriods, setBookingPeriods, bookings, setBookings);

  const { 
    fetchBookings,
    fetchNormalBookings,
    createBooking,
    createNormalBooking,
    isNormalDateRangeAvailable,
    getBookedDatesForApartment,
    testNormalBooking
  } = useBookingManagement(bookings, setBookings, normalBookings, setNormalBookings, bookingPeriods, setBookingPeriods);

  // Fetch data from Supabase on component mount
  useEffect(() => {
    fetchApartments();
    fetchBookingPeriods();
    fetchBookings();
    fetchNormalBookings();
    checkSession();
  }, []);

  return (
    <BookingContext.Provider
      value={{
        apartments,
        bookingPeriods,
        bookings,
        normalBookings,
        userType,
        setUserType,
        addApartment,
        updateApartment,
        deleteApartment,
        addBookingPeriod,
        deleteBookingPeriod,
        createBooking,
        createNormalBooking,
        getApartmentBookingPeriods,
        getAvailableBookingPeriods,
        isNormalDateRangeAvailable,
        getBookedDatesForApartment,
        testNormalBooking,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
        isLoading
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
