
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Apartment, BookingPeriod, Booking } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface BookingContextType {
  apartments: Apartment[];
  bookingPeriods: BookingPeriod[];
  bookings: Booking[];
  userType: "admin" | "user";
  setUserType: (type: "admin" | "user") => void;
  addApartment: (apartment: Omit<Apartment, "id">) => void;
  updateApartment: (apartment: Apartment) => void;
  deleteApartment: (id: string) => void;
  addBookingPeriod: (period: Omit<BookingPeriod, "id">) => void;
  deleteBookingPeriod: (id: string) => void;
  createBooking: (booking: Omit<Booking, "id" | "bookingDate">) => void;
  getApartmentBookingPeriods: (apartmentId: string) => BookingPeriod[];
  getAvailableBookingPeriods: (apartmentId: string) => BookingPeriod[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Sample data
const sampleApartments: Apartment[] = [
  {
    id: "1",
    name: "Luxury Downtown Loft",
    location: "123 Main St, Downtown",
    description: "Beautiful spacious loft with city views and modern amenities.",
    price: 150,
    images: ["/placeholder.svg", "/placeholder.svg"]
  },
  {
    id: "2",
    name: "Beachfront Studio",
    location: "456 Ocean Ave, Beachside",
    description: "Cozy studio apartment with direct access to the beach.",
    price: 120,
    images: ["/placeholder.svg", "/placeholder.svg"]
  },
  {
    id: "3",
    name: "Mountain View Cabin",
    location: "789 Forest Rd, Highland Hills",
    description: "Rustic cabin with panoramic mountain views and fireplace.",
    price: 180,
    images: ["/placeholder.svg", "/placeholder.svg"]
  }
];

// Create some booking periods for the next two weeks
const today = new Date();
const sampleBookingPeriods: BookingPeriod[] = [];

// Generate booking periods for each apartment
sampleApartments.forEach(apartment => {
  for (let i = 0; i < 10; i++) {
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + i * 3);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2);
    
    sampleBookingPeriods.push({
      id: uuidv4(),
      apartmentId: apartment.id,
      startDate,
      endDate,
      isBooked: Math.random() > 0.7 // Some periods are randomly set as booked
    });
  }
});

export const BookingProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [apartments, setApartments] = useState<Apartment[]>(sampleApartments);
  const [bookingPeriods, setBookingPeriods] = useState<BookingPeriod[]>(sampleBookingPeriods);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userType, setUserType] = useState<"admin" | "user">("user");

  const addApartment = (apartment: Omit<Apartment, "id">) => {
    const newApartment = { ...apartment, id: uuidv4() };
    setApartments([...apartments, newApartment]);
  };

  const updateApartment = (apartment: Apartment) => {
    setApartments(apartments.map(apt => apt.id === apartment.id ? apartment : apt));
  };

  const deleteApartment = (id: string) => {
    setApartments(apartments.filter(apt => apt.id !== id));
    setBookingPeriods(bookingPeriods.filter(period => period.apartmentId !== id));
    setBookings(bookings.filter(booking => booking.apartmentId !== id));
  };

  const addBookingPeriod = (period: Omit<BookingPeriod, "id">) => {
    const newPeriod = { ...period, id: uuidv4() };
    setBookingPeriods([...bookingPeriods, newPeriod]);
  };

  const deleteBookingPeriod = (id: string) => {
    setBookingPeriods(bookingPeriods.filter(period => period.id !== id));
    setBookings(bookings.filter(booking => booking.periodId !== id));
  };

  const createBooking = (booking: Omit<Booking, "id" | "bookingDate">) => {
    const newBooking = { 
      ...booking, 
      id: uuidv4(),
      bookingDate: new Date()
    };
    
    // Mark the period as booked
    setBookingPeriods(
      bookingPeriods.map(period => 
        period.id === booking.periodId 
          ? { ...period, isBooked: true }
          : period
      )
    );
    
    setBookings([...bookings, newBooking]);
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
        getAvailableBookingPeriods
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
