
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

type BookingData = {
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
};

export const useBookingsExport = () => {
  const exportToPDF = (bookingsData: BookingData[], bookingType: "period" | "normal") => {
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

    bookingsData.forEach((booking) => {
      const bookingData = [
        booking.userName,
        booking.userEmail,
        booking.userPhone,
        booking.apartmentName,
        booking.startDate,
        booking.endDate,
        booking.nights,
        `${booking.totalAmount} Dh`,
      ];
      tableRows.push(bookingData);
    });

    doc.setFontSize(14);
    doc.text(`${bookingType === "period" ? "Period" : "Normal"} Bookings Report`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), "MMM dd, yyyy")}`, 14, 22);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`${bookingType === "period" ? "period" : "normal"}-bookings-report.pdf`);
  };

  const exportToCSV = (bookingsData: BookingData[], bookingType: "period" | "normal") => {
    const csvData = bookingsData.map((booking) => ({
      "Guest Name": booking.userName,
      "Email": booking.userEmail,
      "Phone": booking.userPhone,
      "Apartment": booking.apartmentName,
      "Location": booking.apartmentLocation,
      "Check-in": booking.startDate,
      "Check-out": booking.endDate,
      "Nights": booking.nights,
      "Booking Date": booking.bookingDate,
      "Total Amount": `${booking.totalAmount} Dh`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, `${bookingType === "period" ? "period" : "normal"}-bookings-report.xlsx`);
  };

  return {
    exportToPDF,
    exportToCSV
  };
};
