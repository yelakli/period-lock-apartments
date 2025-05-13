
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export const useBookingAvailability = () => {
  const isNormalDateRangeAvailable = async (apartmentId: string, startDate: Date, endDate: Date): Promise<boolean> => {
    try {
      console.log("Checking availability for:", { apartmentId, startDate, endDate });
      
      // The correct way to check for overlapping ranges
      const { data, error } = await supabase
        .from('normal_bookings')
        .select('*')
        .eq('apartment_id', apartmentId)
        .or(`start_date.lte.${endDate.toISOString()},end_date.gte.${startDate.toISOString()}`);
      
      if (error) {
        console.error("Error checking date range availability:", error);
        throw error;
      }
      
      console.log("Overlapping bookings found:", data?.length || 0);
      
      // If there are any overlapping bookings, the date range is not available
      return data.length === 0;
    } catch (error) {
      console.error("Error checking date range availability:", error);
      return false;
    }
  };

  const getBookedDatesForApartment = async (apartmentId: string): Promise<Date[]> => {
    try {
      console.log("Fetching booked dates for apartment:", apartmentId);
      
      const { data, error } = await supabase
        .from('normal_bookings')
        .select('start_date, end_date')
        .eq('apartment_id', apartmentId);
      
      if (error) {
        console.error("Error fetching booked dates:", error);
        throw error;
      }

      console.log("Found booking records:", data?.length || 0);

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
      
      console.log("Total booked dates:", bookedDates.length);
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
      
      console.log("Testing normal booking with dates:", { today, tomorrow });
      
      // Check if the date range is available
      const isAvailable = await isNormalDateRangeAvailable(apartmentId, today, tomorrow);
      
      if (!isAvailable) {
        console.log("Date range is not available for testing");
        return false;
      }
      
      // Create a test booking
      const { data, error } = await supabase
        .from('normal_bookings')
        .insert({
          apartment_id: apartmentId,
          user_name: "Test User",
          user_email: "test@example.com",
          user_phone: "+1234567890",
          start_date: today.toISOString(),
          end_date: tomorrow.toISOString()
        })
        .select();
      
      if (error) {
        console.error("Error creating test booking:", error);
        return false;
      }
      
      console.log("Test booking created successfully:", data);
      return data !== null && data.length > 0;
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
