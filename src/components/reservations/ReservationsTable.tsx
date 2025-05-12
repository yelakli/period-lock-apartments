
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Booking, Apartment, BookingPeriod, NormalBooking } from "@/types";
import BookingsSearch from "./BookingsSearch";
import ExportMenu from "./ExportMenu";
import BookingsTable from "./BookingsTable";
import { useBookingsData } from "@/hooks/useBookingsData";
import { useBookingsExport } from "@/hooks/useBookingsExport";

interface ReservationsTableProps {
  bookings: Booking[];
  normalBookings: NormalBooking[];
  apartments: Apartment[];
  bookingPeriods: BookingPeriod[];
}

const ReservationsTable: React.FC<ReservationsTableProps> = ({
  bookings,
  normalBookings,
  apartments,
  bookingPeriods,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"period" | "normal">("period");

  // Use custom hooks to manage data and export functionality
  const { periodBookingsData, normalBookingsData } = useBookingsData(
    bookings,
    normalBookings,
    apartments,
    bookingPeriods,
    searchTerm
  );
  
  const { exportToPDF, exportToCSV } = useBookingsExport();

  // Export handlers
  const handleExportToPDF = () => {
    const bookingsToExport = activeTab === "period" ? periodBookingsData : normalBookingsData;
    exportToPDF(bookingsToExport, activeTab);
  };

  const handleExportToCSV = () => {
    const bookingsToExport = activeTab === "period" ? periodBookingsData : normalBookingsData;
    exportToCSV(bookingsToExport, activeTab);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search component */}
        <BookingsSearch 
          searchTerm={searchTerm} 
          onSearchTermChange={setSearchTerm} 
        />
        
        {/* Export menu */}
        <ExportMenu 
          exportToPDF={handleExportToPDF} 
          exportToCSV={handleExportToCSV} 
        />
      </div>

      {/* Tabs for different booking types */}
      <Tabs 
        defaultValue="period" 
        onValueChange={(value) => setActiveTab(value as "period" | "normal")}
      >
        <TabsList>
          <TabsTrigger value="period">Period Bookings</TabsTrigger>
          <TabsTrigger value="normal">Normal Bookings</TabsTrigger>
        </TabsList>
        
        {/* Period bookings tab */}
        <TabsContent value="period">
          <BookingsTable 
            bookingsData={periodBookingsData} 
            type="period" 
          />
        </TabsContent>
        
        {/* Normal bookings tab */}
        <TabsContent value="normal">
          <BookingsTable 
            bookingsData={normalBookingsData} 
            type="normal" 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReservationsTable;
