
import { Booking, NormalBooking } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const useFetchBookings = (
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
  setNormalBookings: React.Dispatch<React.SetStateAction<NormalBooking[]>>
) => {
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

  const fetchNormalBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('normal_bookings')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        setNormalBookings(data.map(booking => ({
          ...booking,
          apartmentId: booking.apartment_id,
          userName: booking.user_name,
          userEmail: booking.user_email,
          userPhone: booking.user_phone,
          startDate: new Date(booking.start_date),
          endDate: new Date(booking.end_date),
          bookingDate: new Date(booking.booking_date)
        })));
      }
    } catch (error) {
      console.error("Error fetching normal bookings:", error);
    }
  };

  return { fetchBookings, fetchNormalBookings };
};
