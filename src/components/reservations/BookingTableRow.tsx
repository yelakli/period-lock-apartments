
import React from "react";
import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import BookingActions from "./BookingActions";

interface BookingRowProps {
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
  type: "period" | "normal";
  onDelete: (id: string) => Promise<{ success: boolean; error?: any }>;
  onUpdate: (id: string, updates: any) => Promise<{ success: boolean; error?: any }>;
}

const BookingTableRow: React.FC<BookingRowProps> = ({
  id,
  userName,
  userEmail,
  userPhone,
  apartmentName,
  apartmentLocation,
  startDate,
  endDate,
  nights,
  bookingDate,
  totalAmount,
  type,
  onDelete,
  onUpdate,
}) => {
  const bookingData = {
    id,
    userName,
    userEmail,
    userPhone,
    apartmentName,
    apartmentLocation,
    startDate,
    endDate,
    nights,
    bookingDate,
    totalAmount,
  };

  return (
    <TableRow key={id}>
      <TableCell className="font-medium">{userName}</TableCell>
      <TableCell>
        <div className="text-xs">
          <p>{userEmail}</p>
          <p>{userPhone}</p>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p>{apartmentName}</p>
          <p className="text-xs text-muted-foreground">{apartmentLocation}</p>
        </div>
      </TableCell>
      <TableCell>{startDate}</TableCell>
      <TableCell>{endDate}</TableCell>
      <TableCell>{nights}</TableCell>
      <TableCell className="text-sm text-muted-foreground">{bookingDate}</TableCell>
      <TableCell className="text-right font-medium">{totalAmount} Dh</TableCell>
      <TableCell>
        <BookingActions
          booking={bookingData}
          type={type}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      </TableCell>
    </TableRow>
  );
};

export default BookingTableRow;
