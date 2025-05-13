
import React from "react";
import { MapPin } from "lucide-react";
import BookingTester from "@/components/reservations/BookingTester";
import { Apartment } from "@/types";

interface ApartmentInfoProps {
  apartment: Apartment;
  isAdminLoggedIn: boolean;
}

const ApartmentInfo: React.FC<ApartmentInfoProps> = ({ apartment, isAdminLoggedIn }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{apartment.name}</h1>
      
      <div className="flex items-start space-x-1 text-gray-600 mb-6">
        <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <span>{apartment.location}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {apartment.images && apartment.images.length > 0 ? (
          apartment.images.map((image, index) => (
            <div key={index} className="aspect-video bg-gray-100 rounded-md overflow-hidden">
              <img
                src={image}
                alt={`${apartment.name} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-gray-400">No images available</span>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">A PROPOS</h2>
        <p className="text-gray-600 whitespace-pre-line">{apartment.description}</p>
      </div>
      
      {/* Admin testing section */}
      {isAdminLoggedIn && apartment.bookingType === "normal" && (
        <div className="bg-slate-50 p-4 border rounded-md mb-8">
          <h3 className="text-lg font-medium mb-2">Admin Tools</h3>
          <BookingTester apartmentId={apartment.id} />
        </div>
      )}
    </div>
  );
};

export default ApartmentInfo;
