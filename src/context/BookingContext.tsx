
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Apartment, BookingPeriod, Booking } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BookingContextType {
  apartments: Apartment[];
  bookingPeriods: BookingPeriod[];
  bookings: Booking[];
  userType: "admin" | "user";
  setUserType: (type: "admin" | "user") => void;
  addApartment: (apartment: Omit<Apartment, "id">) => Promise<void>;
  updateApartment: (apartment: Apartment) => Promise<void>;
  deleteApartment: (id: string) => Promise<void>;
  addBookingPeriod: (period: Omit<BookingPeriod, "id">) => Promise<void>;
  deleteBookingPeriod: (id: string) => Promise<void>;
  createBooking: (booking: Omit<Booking, "id" | "bookingDate">) => Promise<void>;
  getApartmentBookingPeriods: (apartmentId: string) => BookingPeriod[];
  getAvailableBookingPeriods: (apartmentId: string) => BookingPeriod[];
  isAdminLoggedIn: boolean;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => Promise<void>;
  isLoading: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [bookingPeriods, setBookingPeriods] = useState<BookingPeriod[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userType, setUserType] = useState<"admin" | "user">("user");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch data from Supabase on component mount
  useEffect(() => {
    fetchApartments();
    fetchBookingPeriods();
    fetchBookings();
    checkSession();
  }, []);

  // Check for existing user session
  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setIsAdminLoggedIn(true);
      setUserType("admin");
    }
  };

  // Fetch apartments from Supabase
  const fetchApartments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('apartments')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        setApartments(data.map(apt => ({
          ...apt,
          price: Number(apt.price)
        })));
      }
    } catch (error) {
      console.error("Error fetching apartments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch booking periods from Supabase
  const fetchBookingPeriods = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_periods')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        setBookingPeriods(data.map(period => ({
          ...period,
          startDate: new Date(period.start_date),
          endDate: new Date(period.end_date),
          apartmentId: period.apartment_id,
          isBooked: period.is_booked
        })));
      }
    } catch (error) {
      console.error("Error fetching booking periods:", error);
    }
  };

  // Fetch bookings from Supabase
  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        setBookings(data.map(booking => ({
          ...booking,
          periodId: booking.period_id,
          apartmentId: booking.apartment_id,
          userName: booking.user_name,
          userEmail: booking.user_email,
          userPhone: booking.user_phone,
          bookingDate: new Date(booking.booking_date)
        })));
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.session) {
        setIsAdminLoggedIn(true);
        setUserType("admin");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const adminLogout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setIsAdminLoggedIn(false);
      setUserType("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const addApartment = async (apartment: Omit<Apartment, "id">) => {
    try {
      // Make sure we have a session before attempting to add/update data
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("You must be logged in as an admin to perform this action");
        return;
      }

      const { data, error } = await supabase
        .from('apartments')
        .insert({
          name: apartment.name,
          location: apartment.location,
          description: apartment.description,
          price: apartment.price,
          images: apartment.images
        })
        .select();
      
      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      
      if (data) {
        const newApartment = {
          ...data[0],
          price: Number(data[0].price)
        };
        setApartments([...apartments, newApartment]);
        toast.success("Apartment added successfully!");
      }
    } catch (error) {
      console.error("Error adding apartment:", error);
      toast.error("Failed to add apartment. Please try again.");
    }
  };

  const updateApartment = async (apartment: Apartment) => {
    try {
      // Make sure we have a session before attempting to add/update data
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("You must be logged in as an admin to perform this action");
        return;
      }

      const { error } = await supabase
        .from('apartments')
        .update({
          name: apartment.name,
          location: apartment.location,
          description: apartment.description,
          price: apartment.price,
          images: apartment.images
        })
        .eq('id', apartment.id);
      
      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      
      // Update local state
      setApartments(apartments.map(apt => 
        apt.id === apartment.id ? { ...apartment, price: Number(apartment.price) } : apt
      ));
      
      toast.success("Apartment updated successfully!");
    } catch (error) {
      console.error("Error updating apartment:", error);
      toast.error("Failed to update apartment. Please try again.");
    }
  };

  const deleteApartment = async (id: string) => {
    try {
      // Make sure we have a session before attempting to add/update data
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("You must be logged in as an admin to perform this action");
        return;
      }

      const { error } = await supabase
        .from('apartments')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      
      // Update local state
      setApartments(apartments.filter(apt => apt.id !== id));
      setBookingPeriods(bookingPeriods.filter(period => period.apartmentId !== id));
      setBookings(bookings.filter(booking => booking.apartmentId !== id));
      
      toast.success("Apartment deleted successfully!");
    } catch (error) {
      console.error("Error deleting apartment:", error);
      toast.error("Failed to delete apartment. Please try again.");
    }
  };

  const addBookingPeriod = async (period: Omit<BookingPeriod, "id">) => {
    try {
      // Make sure we have a session before attempting to add/update data
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("You must be logged in as an admin to perform this action");
        return;
      }

      const { data, error } = await supabase
        .from('booking_periods')
        .insert({
          apartment_id: period.apartmentId,
          start_date: period.startDate.toISOString(),
          end_date: period.endDate.toISOString(),
          is_booked: period.isBooked
        })
        .select();
      
      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      
      if (data) {
        const newPeriod = {
          id: data[0].id,
          apartmentId: data[0].apartment_id,
          startDate: new Date(data[0].start_date),
          endDate: new Date(data[0].end_date),
          isBooked: data[0].is_booked
        };
        setBookingPeriods([...bookingPeriods, newPeriod]);
        toast.success("Booking period added successfully!");
      }
    } catch (error) {
      console.error("Error adding booking period:", error);
      toast.error("Failed to add booking period. Please try again.");
    }
  };

  const deleteBookingPeriod = async (id: string) => {
    try {
      // Make sure we have a session before attempting to add/update data
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("You must be logged in as an admin to perform this action");
        return;
      }

      const { error } = await supabase
        .from('booking_periods')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      
      // Update local state
      setBookingPeriods(bookingPeriods.filter(period => period.id !== id));
      setBookings(bookings.filter(booking => booking.periodId !== id));
      
      toast.success("Booking period deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking period:", error);
      toast.error("Failed to delete booking period. Please try again.");
    }
  };

  const createBooking = async (booking: Omit<Booking, "id" | "bookingDate">) => {
    try {
      // Add booking to database
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          period_id: booking.periodId,
          apartment_id: booking.apartmentId,
          user_name: booking.userName,
          user_email: booking.userEmail,
          user_phone: booking.userPhone
        })
        .select();
      
      if (error) throw error;
      
      // Mark period as booked
      const periodUpdateResult = await supabase
        .from('booking_periods')
        .update({ is_booked: true })
        .eq('id', booking.periodId);
        
      if (periodUpdateResult.error) {
        console.error("Error updating period:", periodUpdateResult.error);
        throw periodUpdateResult.error;
      }
      
      // Update local state
      setBookingPeriods(
        bookingPeriods.map(period => 
          period.id === booking.periodId 
            ? { ...period, isBooked: true }
            : period
        )
      );
      
      if (data) {
        const newBooking = {
          id: data[0].id,
          periodId: data[0].period_id,
          apartmentId: data[0].apartment_id,
          userName: data[0].user_name,
          userEmail: data[0].user_email,
          userPhone: data[0].user_phone,
          bookingDate: new Date(data[0].booking_date)
        };
        setBookings([...bookings, newBooking]);
        toast.success("Booking created successfully!");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  const getApartmentBookingPeriods = (apartmentId: string) => {
    return bookingPeriods.filter(period => period.apartmentId === apartmentId);
  };

  const getAvailableBookingPeriods = (apartmentId: string) => {
    return bookingPeriods.filter(period => period.apartmentId === apartmentId && !period.isBooked);
  };

  return (
    <BookingContext.Provider
      value={{
        apartments,
        bookingPeriods,
        bookings,
        userType,
        setUserType,
        addApartment,
        updateApartment,
        deleteApartment,
        addBookingPeriod,
        deleteBookingPeriod,
        createBooking,
        getApartmentBookingPeriods,
        getAvailableBookingPeriods,
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
