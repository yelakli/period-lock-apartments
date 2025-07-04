
import { supabase } from "@/integrations/supabase/client";
import { Booking, NormalBooking } from "@/types";

export const useBookingActions = (
  bookings: Booking[],
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
  normalBookings: NormalBooking[],
  setNormalBookings: React.Dispatch<React.SetStateAction<NormalBooking[]>>
) => {
  const deleteBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Update local state
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting booking:", error);
      return { success: false, error };
    }
  };

  const deleteNormalBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('normal_bookings')
        .delete()
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Update local state
      setNormalBookings(prev => prev.filter(booking => booking.id !== bookingId));
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting normal booking:", error);
      return { success: false, error };
    }
  };

  const updateBooking = async (bookingId: string, updates: Partial<Booking>) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          user_name: updates.userName,
          user_email: updates.userEmail,
          user_phone: updates.userPhone
        })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, ...updates }
          : booking
      ));
      
      return { success: true };
    } catch (error) {
      console.error("Error updating booking:", error);
      return { success: false, error };
    }
  };

  const updateNormalBooking = async (bookingId: string, updates: Partial<NormalBooking>) => {
    try {
      const { error } = await supabase
        .from('normal_bookings')
        .update({
          user_name: updates.userName,
          user_email: updates.userEmail,
          user_phone: updates.userPhone
        })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Update local state
      setNormalBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, ...updates }
          : booking
      ));
      
      return { success: true };
    } catch (error) {
      console.error("Error updating normal booking:", error);
      return { success: false, error };
    }
  };

  return {
    deleteBooking,
    deleteNormalBooking,
    updateBooking,
    updateNormalBooking
  };
};
