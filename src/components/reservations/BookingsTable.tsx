
import React from "react";
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

const BookingsTable: React.FC<BookingsTableProps> = ({ bookingsData, type }) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableCaption>
          {bookingsData.length === 0
            ? `No ${type} reservations found.`
            : `A list of ${bookingsData.length} ${type} reservation${
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
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookingsData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No {type} reservations found
              </TableCell>
            </TableRow>
          ) : (
            bookingsData.map((booking) => (
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
                totalAmount={booking.totalAmount}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingsTable;
