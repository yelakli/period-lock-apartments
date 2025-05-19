
import { useState } from "react";
import { Apartment } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useApartmentManagement = (
  apartments: Apartment[],
  setApartments: React.Dispatch<React.SetStateAction<Apartment[]>>,
  bookingPeriods: any[],
  setBookingPeriods: React.Dispatch<React.SetStateAction<any[]>>,
  bookings: any[],
  setBookings: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchApartments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('apartments')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        // Explicitly cast booking_type to "period" | "normal"
        setApartments(data.map(apt => ({
          ...apt,
          price: Number(apt.price),
          bookingType: apt.booking_type as "period" | "normal",
          minNights: apt.min_nights,
          maxNights: apt.max_nights,
          disableBookedDates: apt.disable_booked_dates,
          images: apt.images || []
        })));
      }
    } catch (error) {
      console.error("Error fetching apartments:", error);
    } finally {
      setIsLoading(false);
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
          images: apartment.images,
          booking_type: apartment.bookingType,
          min_nights: apartment.minNights,
          max_nights: apartment.maxNights,
          disable_booked_dates: apartment.disableBookedDates
        })
        .select();
      
      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      
      if (data) {
        const newApartment: Apartment = {
          ...data[0],
          id: data[0].id,
          price: Number(data[0].price),
          bookingType: data[0].booking_type as "period" | "normal",
          minNights: data[0].min_nights,
          maxNights: data[0].max_nights,
          disableBookedDates: data[0].disable_booked_dates,
          images: data[0].images || []
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
          images: apartment.images,
          booking_type: apartment.bookingType,
          min_nights: apartment.minNights,
          max_nights: apartment.maxNights,
          disable_booked_dates: apartment.disableBookedDates
        })
        .eq('id', apartment.id);
      
      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      
      // Update local state
      setApartments(apartments.map(apt => 
        apt.id === apartment.id ? { 
          ...apartment, 
          price: Number(apartment.price)
        } : apt
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

  return {
    isLoading,
    fetchApartments,
    addApartment,
    updateApartment,
    deleteApartment
  };
};
