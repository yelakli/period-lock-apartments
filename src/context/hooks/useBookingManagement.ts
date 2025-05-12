import { Booking, NormalBooking } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBookingManagement = (
  bookings: Booking[],
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
  normalBookings: NormalBooking[],
  setNormalBookings: React.Dispatch<React.SetStateAction<NormalBooking[]>>,
  bookingPeriods: any[],
  setBookingPeriods: React.Dispatch<React.SetStateAction<any[]>>
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

  const createNormalBooking = async (booking: Omit<NormalBooking, "id" | "bookingDate">) => {
    try {
      console.log("Creating normal booking:", booking);
      // Add booking to database
      const { data, error } = await supabase
        .from('normal_bookings')
        .insert({
          apartment_id: booking.apartmentId,
          user_name: booking.userName,
          user_email: booking.userEmail,
          user_phone: booking.userPhone,
          start_date: booking.startDate.toISOString(),
          end_date: booking.endDate.toISOString()
        })
        .select();
      
      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      
      if (data) {
        console.log("Normal booking created successfully:", data);
        const newBooking = {
          id: data[0].id,
          apartmentId: data[0].apartment_id,
          userName: data[0].user_name,
          userEmail: data[0].user_email,
          userPhone: data[0].user_phone,
          startDate: new Date(data[0].start_date),
          endDate: new Date(data[0].end_date),
          bookingDate: new Date(data[0].booking_date)
        };
        setNormalBookings([...normalBookings, newBooking]);
        toast.success("Booking created successfully!");
        return { success: true, booking: newBooking };
      }
      return { success: false, error: "No data returned from database" };
    } catch (error: any) {
      console.error("Error creating normal booking:", error);
      
      // Check if error message is from the validation trigger
      if (error.message?.includes("nights")) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create booking. Please try again.");
      }
      return { success: false, error };
    }
  };

  const isNormalDateRangeAvailable = async (apartmentId: string, startDate: Date, endDate: Date): Promise<boolean> => {
    try {
      // Check for overlapping bookings using a more precise query
      const { data, error } = await supabase
        .from('normal_bookings')
        .select('*')
        .eq('apartment_id', apartmentId)
        .or(`start_date,lte,${endDate.toISOString()},end_date,gte,${startDate.toISOString()}`);
      
      if (error) throw error;
      
      // If there are any overlapping bookings, the date range is not available
      return data.length === 0;
    } catch (error) {
      console.error("Error checking date range availability:", error);
      return false;
    }
  };

  // Function for testing normal bookings
  const testNormalBooking = async (apartmentId: string): Promise<boolean> => {
    try {
      // Create a test booking for today and tomorrow
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      // Check if the date range is available
      const isAvailable = await isNormalDateRangeAvailable(apartmentId, today, tomorrow);
      
      if (!isAvailable) {
        console.log("Date range is not available for testing");
        return false;
      }
      
      // Create a test booking
      const testBooking = {
        apartmentId,
        userName: "Test User",
        userEmail: "test@example.com",
        userPhone: "+1234567890",
        startDate: today,
        endDate: tomorrow
      };
      
      const result = await createNormalBooking(testBooking);
      
      return result.success;
    } catch (error) {
      console.error("Error testing normal booking:", error);
      return false;
    }
  };

  return {
    fetchBookings,
    fetchNormalBookings,
    createBooking,
    createNormalBooking,
    isNormalDateRangeAvailable,
    testNormalBooking
  };
};