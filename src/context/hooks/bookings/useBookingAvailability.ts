
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export const useBookingAvailability = () => {
  const isNormalDateRangeAvailable = async (apartmentId: string, startDate: Date, endDate: Date): Promise<boolean> => {
    try {
      // Fix the query to properly check for overlapping bookings
      const { data, error } = await supabase
        .from('normal_bookings')
        .select('*')
        .eq('apartment_id', apartmentId)
        .or(`start_date,lt.${endDate.toISOString()},end_date,gt.${startDate.toISOString()}`);
      
      if (error) {
        console.error("Error checking date range availability:", error);
        throw error;
      }
      
      // If there are any overlapping bookings, the date range is not available
      return data.length === 0;
    } catch (error) {
      console.error("Error checking date range availability:", error);
      return false;
    }
  };

  const getBookedDatesForApartment = async (apartmentId: string): Promise<Date[]> => {
    try {
      const { data, error } = await supabase
        .from('normal_bookings')
        .select('start_date, end_date')
        .eq('apartment_id', apartmentId);
      
      if (error) {
        console.error("Error fetching booked dates:", error);
        throw error;
      }

      // Create an array of all booked dates (including dates between start and end)
      const bookedDates: Date[] = [];
      
      for (const booking of data) {
        const startDate = new Date(booking.start_date);
        const endDate = new Date(booking.end_date);
        
        // Add all dates between start and end (inclusive)
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          bookedDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
      
      return bookedDates;
    } catch (error) {
      console.error("Error getting booked dates:", error);
      return [];
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
      
      // This is a test function, so we need to create the booking
      // but we don't have access to createNormalBooking here
      // Instead, we'll manually create the booking in the database
      const { data, error } = await supabase
        .from('normal_bookings')
        .insert({
          apartment_id: testBooking.apartmentId,
          user_name: testBooking.userName,
          user_email: testBooking.userEmail,
          user_phone: testBooking.userPhone,
          start_date: testBooking.startDate.toISOString(),
          end_date: testBooking.endDate.toISOString()
        })
        .select();
      
      return error === null && data !== null;
    } catch (error) {
      console.error("Error testing normal booking:", error);
      return false;
    }
  };

  return {
    isNormalDateRangeAvailable,
    getBookedDatesForApartment,
    testNormalBooking
  };
};
