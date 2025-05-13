
import { NormalBooking } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCreateNormalBooking = (
  normalBookings: NormalBooking[],
  setNormalBookings: React.Dispatch<React.SetStateAction<NormalBooking[]>>
) => {
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

  return { createNormalBooking };
};
