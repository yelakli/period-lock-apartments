
import { Booking, NormalBooking } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCreateBooking = (
  bookings: Booking[],
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
  bookingPeriods: any[],
  setBookingPeriods: React.Dispatch<React.SetStateAction<any[]>>
) => {
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

  return { createBooking };
};
