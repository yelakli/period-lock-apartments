
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BookingTableRow from "./BookingTableRow";
import TablePagination from "./TablePagination";

interface BookingData {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  apartmentName: string;
  apartmentLocation: string;
  startDate: string;
  endDate: string;
  nights: number;
  bookingDate: string;
  totalAmount: number;
}

interface BookingsTableProps {
  bookingsData: BookingData[];
  type: "period" | "normal";
}

const ITEMS_PER_PAGE = 5;

const BookingsTable: React.FC<BookingsTableProps> = ({ bookingsData, type }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(bookingsData.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBookings = bookingsData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableCaption>
            {bookingsData.length === 0
              ? `No ${type} reservations found.`
              : `Showing ${startIndex + 1}-${Math.min(startIndex + ITEMS_PER_PAGE, bookingsData.length)} of ${bookingsData.length} ${type} reservation${
                  bookingsData.length === 1 ? "" : "s"
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
              <TableHead>Booking Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookingsData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No {type} reservations found
                </TableCell>
              </TableRow>
            ) : (
              paginatedBookings.map((booking) => (
                <BookingTableRow
                  key={booking.id}
                  id={booking.id}
                  userName={booking.userName}
                  userEmail={booking.userEmail}
                  userPhone={booking.userPhone}
                  apartmentName={booking.apartmentName}
                  apartmentLocation={booking.apartmentLocation}
                  startDate={booking.startDate}
                  endDate={booking.endDate}
                  nights={booking.nights}
                  bookingDate={booking.bookingDate}
                  totalAmount={booking.totalAmount}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {bookingsData.length > ITEMS_PER_PAGE && (
        <TablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default BookingsTable;
