
import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { Download, FileText, Search } from "lucide-react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

import { Booking, Apartment, BookingPeriod, NormalBooking } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const apartment = apartments.find((a) => a.id === booking.apartmentId);
      const period = bookingPeriods.find((p) => p.id === booking.periodId);
      
      if (!apartment || !period) return false;
      
      const searchString = `${booking.userName} ${booking.userEmail || ""} ${
        booking.userPhone || ""
      } ${apartment.name} ${apartment.location}`.toLowerCase();
      
      return searchString.includes(searchTerm.toLowerCase());
    });
  }, [bookings, apartments, bookingPeriods, searchTerm]);

  const filteredNormalBookings = useMemo(() => {
    return normalBookings.filter((booking) => {
      const apartment = apartments.find((a) => a.id === booking.apartmentId);
      
      if (!apartment) return false;
      
      const searchString = `${booking.userName} ${booking.userEmail || ""} ${
        booking.userPhone || ""
      } ${apartment.name} ${apartment.location}`.toLowerCase();
      
      return searchString.includes(searchTerm.toLowerCase());
    });
  }, [normalBookings, apartments, searchTerm]);

  const periodBookingsData = useMemo(() => {
    return filteredBookings.map((booking) => {
      const apartment = apartments.find((a) => a.id === booking.apartmentId);
      const period = bookingPeriods.find((p) => p.id === booking.periodId);
      
      if (!apartment || !period) return null;
      
      const nights = Math.round(
        (new Date(period.endDate).getTime() - new Date(period.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      
      return {
        id: booking.id,
        userName: booking.userName,
        userEmail: booking.userEmail || "N/A",
        userPhone: booking.userPhone || "N/A",
        apartmentName: apartment.name,
        apartmentLocation: apartment.location,
        startDate: format(new Date(period.startDate), "MMM dd, yyyy"),
        endDate: format(new Date(period.endDate), "MMM dd, yyyy"),
        nights: nights,
        bookingDate: format(new Date(booking.bookingDate), "MMM dd, yyyy"),
        totalAmount: apartment.price * nights,
      };
    }).filter(Boolean);
  }, [filteredBookings, apartments, bookingPeriods]);

  const normalBookingsData = useMemo(() => {
    return filteredNormalBookings.map((booking) => {
      const apartment = apartments.find((a) => a.id === booking.apartmentId);
      
      if (!apartment) return null;
      
      const nights = Math.round(
        (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      
      return {
        id: booking.id,
        userName: booking.userName,
        userEmail: booking.userEmail || "N/A",
        userPhone: booking.userPhone || "N/A",
        apartmentName: apartment.name,
        apartmentLocation: apartment.location,
        startDate: format(new Date(booking.startDate), "MMM dd, yyyy"),
        endDate: format(new Date(booking.endDate), "MMM dd, yyyy"),
        nights: nights,
        bookingDate: format(new Date(booking.bookingDate), "MMM dd, yyyy"),
        totalAmount: apartment.price * nights,
      };
    }).filter(Boolean);
  }, [filteredNormalBookings, apartments]);

  const exportToPDF = () => {
    const doc = new jsPDF("landscape");
    const tableColumn = [
      "Guest Name",
      "Email",
      "Phone",
      "Apartment",
      "Check-in",
      "Check-out",
      "Nights",
      "Total Price",
    ];
    const tableRows: any[][] = [];

    const bookingsToExport = activeTab === "period" ? periodBookingsData : normalBookingsData;
    
    bookingsToExport.forEach((booking) => {
      const bookingData = [
        booking!.userName,
        booking!.userEmail,
        booking!.userPhone,
        booking!.apartmentName,
        booking!.startDate,
        booking!.endDate,
        booking!.nights,
        `${booking!.totalAmount} Dh`,
      ];
      tableRows.push(bookingData);
    });

    doc.setFontSize(14);
    doc.text(`${activeTab === "period" ? "Period" : "Normal"} Bookings Report`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), "MMM dd, yyyy")}`, 14, 22);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`${activeTab === "period" ? "period" : "normal"}-bookings-report.pdf`);
  };

  const exportToCSV = () => {
    const bookingsToExport = activeTab === "period" ? periodBookingsData : normalBookingsData;
    
    const csvData = bookingsToExport.map((booking) => ({
      "Guest Name": booking!.userName,
      "Email": booking!.userEmail,
      "Phone": booking!.userPhone,
      "Apartment": booking!.apartmentName,
      "Location": booking!.apartmentLocation,
      "Check-in": booking!.startDate,
      "Check-out": booking!.endDate,
      "Nights": booking!.nights,
      "Booking Date": booking!.bookingDate,
      "Total Amount": `${booking!.totalAmount} Dh`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, `${activeTab === "period" ? "period" : "normal"}-bookings-report.xlsx`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reservations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToPDF}>
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToCSV}>
                <FileText className="mr-2 h-4 w-4" />
                Excel/CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="period" onValueChange={(value) => setActiveTab(value as "period" | "normal")}>
        <TabsList>
          <TabsTrigger value="period">Period Bookings</TabsTrigger>
          <TabsTrigger value="normal">Normal Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="period">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableCaption>
                {filteredBookings.length === 0
                  ? "No period reservations found."
                  : `A list of ${filteredBookings.length} period reservation${
                      filteredBookings.length === 1 ? "" : "s"
                    }.`}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Apartment</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Nights</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {periodBookingsData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No period reservations found
                    </TableCell>
                  </TableRow>
                ) : (
                  periodBookingsData.map((booking) => (
                    <TableRow key={booking!.id}>
                      <TableCell className="font-medium">{booking!.userName}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p>{booking!.userEmail}</p>
                          <p>{booking!.userPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{booking!.apartmentName}</p>
                          <p className="text-xs text-muted-foreground">{booking!.apartmentLocation}</p>
                        </div>
                      </TableCell>
                      <TableCell>{booking!.startDate}</TableCell>
                      <TableCell>{booking!.endDate}</TableCell>
                      <TableCell>{booking!.nights}</TableCell>
                      <TableCell className="text-right font-medium">{booking!.totalAmount} Dh</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="normal">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableCaption>
                {filteredNormalBookings.length === 0
                  ? "No normal reservations found."
                  : `A list of ${filteredNormalBookings.length} normal reservation${
                      filteredNormalBookings.length === 1 ? "" : "s"
                    }.`}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Apartment</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Nights</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {normalBookingsData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No normal reservations found
                    </TableCell>
                  </TableRow>
                ) : (
                  normalBookingsData.map((booking) => (
                    <TableRow key={booking!.id}>
                      <TableCell className="font-medium">{booking!.userName}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p>{booking!.userEmail}</p>
                          <p>{booking!.userPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{booking!.apartmentName}</p>
                          <p className="text-xs text-muted-foreground">{booking!.apartmentLocation}</p>
                        </div>
                      </TableCell>
                      <TableCell>{booking!.startDate}</TableCell>
                      <TableCell>{booking!.endDate}</TableCell>
                      <TableCell>{booking!.nights}</TableCell>
                      <TableCell className="text-right font-medium">{booking!.totalAmount} Dh</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReservationsTable;
