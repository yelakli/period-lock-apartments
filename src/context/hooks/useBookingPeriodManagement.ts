
import { BookingPeriod } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBookingPeriodManagement = (
  bookingPeriods: BookingPeriod[],
  setBookingPeriods: React.Dispatch<React.SetStateAction<BookingPeriod[]>>,
  bookings: any[],
  setBookings: React.Dispatch<React.SetStateAction<any[]>>
) => {
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

  const getApartmentBookingPeriods = (apartmentId: string) => {
    return bookingPeriods.filter(period => period.apartmentId === apartmentId);
  };

  const getAvailableBookingPeriods = (apartmentId: string) => {
    return bookingPeriods.filter(period => period.apartmentId === apartmentId && !period.isBooked);
  };

  return {
    fetchBookingPeriods,
    addBookingPeriod,
    deleteBookingPeriod,
    getApartmentBookingPeriods,
    getAvailableBookingPeriods
  };
};
