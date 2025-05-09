
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBooking } from "@/context/BookingContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { MapPin, Calendar as CalendarIcon } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

const ApartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    apartments, 
    getAvailableBookingPeriods, 
    createBooking,
    createNormalBooking,
    isNormalDateRangeAvailable
  } = useBooking();
  
  const apartment = apartments.find((a) => a.id === id);
  const availablePeriods = apartment ? getAvailableBookingPeriods(id || "") : [];

  // State for period booking
  const [selectedPeriodId, setSelectedPeriodId] = useState("");
  
  // State for normal booking
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isDateRangeAvailable, setIsDateRangeAvailable] = useState<boolean | null>(null);

  // Common state
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  
  const selectedPeriod = availablePeriods.find(period => period.id === selectedPeriodId);
  
  // Calculate the number of nights for normal booking
  const nightsCount = startDate && endDate ? 
    differenceInDays(new Date(endDate), new Date(startDate)) : 0;

  // Calculate the total price for normal booking
  const totalPrice = apartment && nightsCount ? apartment.price * nightsCount : 0;
  
  const handleCheckAvailability = async () => {
    if (!apartment || !startDate || !endDate || !id) return;
    
    setIsCheckingAvailability(true);
    try {
      const isAvailable = await isNormalDateRangeAvailable(id, startDate, endDate);
      setIsDateRangeAvailable(isAvailable);
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Failed to check availability");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (!startDate || (startDate && endDate)) {
      // If no start date is selected or both dates are selected, set the new date as the start date
      setStartDate(date);
      setEndDate(undefined);
      setIsDateRangeAvailable(null);
    } else {
      // If only the start date is selected and the new date is after the start date
      if (date > startDate) {
        setEndDate(date);
        // Reset availability until checked
        setIsDateRangeAvailable(null);
      } else {
        // If the new date is before or equal to the start date, update the start date
        setStartDate(date);
        setEndDate(undefined);
        setIsDateRangeAvailable(null);
      }
    }
  };
  
  const handleSubmitPeriodBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPeriodId || !userName || !userEmail || !userPhone) {
      toast.error("Please fill in all fields");
      return;
    }
    
    createBooking({
      periodId: selectedPeriodId,
      apartmentId: id || "",
      userName,
      userEmail,
      userPhone
    });
    
    toast.success("Reservation made successfully!");
    navigate("/");
  };
  
  const handleSubmitNormalBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !userName || !userEmail || !userPhone) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (!isDateRangeAvailable) {
      toast.error("Please check availability before booking");
      return;
    }
    
    createNormalBooking({
      apartmentId: id || "",
      userName,
      userEmail,
      userPhone,
      startDate,
      endDate
    });
    
    toast.success("Reservation made successfully!");
    navigate("/");
  };
  
  if (!apartment) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Apartment not found</h2>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
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
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600 whitespace-pre-line">{apartment.description}</p>
            </div>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-baseline justify-between mb-4">
                  <div className="text-2xl font-semibold">{formatCurrency(apartment.price)} DH</div>
                  <div className="text-sm text-gray-500">per night</div>
                </div>
                
                {/* Period Booking Form */}
                {apartment.bookingType === "period" && (
                  <form onSubmit={handleSubmitPeriodBooking} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="period" className="text-sm font-medium text-gray-700">
                        Select desired period
                      </label>
                      <Select
                        value={selectedPeriodId}
                        onValueChange={setSelectedPeriodId}
                      >
                        <SelectTrigger id="period" className="w-full">
                          <SelectValue placeholder="Choose your period" />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePeriods.length === 0 ? (
                            <SelectItem value="none" disabled>
                              No periods available
                            </SelectItem>
                          ) : (
                            availablePeriods.map((period) => (
                              <SelectItem key={period.id} value={period.id}>
                                {format(new Date(period.startDate), "MMM dd")} - {format(new Date(period.endDate), "MMM dd, yyyy")}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedPeriod && (
                      <div className="bg-blue-50 p-3 rounded-md flex items-start space-x-2">
                        <CalendarIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-700">
                            {format(new Date(selectedPeriod.startDate), "MMMM dd")} - {format(new Date(selectedPeriod.endDate), "MMMM dd, yyyy")}
                          </p>
                          <p className="text-sm text-blue-600">
                            {Math.round((new Date(selectedPeriod.endDate).getTime() - new Date(selectedPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24))} nights
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-4 pt-2">
                      <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <Input
                          id="name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    
                    {selectedPeriod && (
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">
                            {formatCurrency(apartment.price)} DH x {Math.round((new Date(selectedPeriod.endDate).getTime() - new Date(selectedPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24))} nights
                          </span>
                          <span className="font-medium">
                            {formatCurrency(apartment.price * Math.round((new Date(selectedPeriod.endDate).getTime() - new Date(selectedPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24)))} DH
                          </span>
                        </div>
                       
                        <div className="flex justify-between pt-3 border-t font-semibold">
                          <span>Total</span>
                          <span>
                            {formatCurrency(
                              apartment.price * Math.round((new Date(selectedPeriod.endDate).getTime() - new Date(selectedPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24))
                            )} DH
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={!selectedPeriodId || !userName || !userEmail || !userPhone}
                    >
                      Reserve
                    </Button>
                  </form>
                )}
                
                {/* Normal Booking Form */}
                {apartment.bookingType === "normal" && (
                  <form onSubmit={handleSubmitNormalBooking} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Select Dates
                      </label>
                      <div className="text-xs text-gray-500 mb-2">
                        {apartment.minNights && apartment.maxNights ? 
                          `Min: ${apartment.minNights} nights | Max: ${apartment.maxNights} nights` : 
                          apartment.minNights ? 
                            `Min: ${apartment.minNights} nights` : 
                            apartment.maxNights ? 
                              `Max: ${apartment.maxNights} nights` : ""}
                      </div>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? (
                              endDate ? (
                                <>
                                  {format(startDate, "MMM dd, yyyy")} - {format(endDate, "MMM dd, yyyy")}
                                </>
                              ) : (
                                format(startDate, "MMM dd, yyyy")
                              )
                            ) : (
                              <span>Select dates</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={handleDateSelect}
                            initialFocus
                            disabled={(date) => date < new Date()}
                            className={cn("p-3 pointer-events-auto")}
                          />
                          {startDate && !endDate && (
                            <div className="px-4 py-2 border-t text-sm text-muted-foreground">
                              Select an end date
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {startDate && endDate && (
                      <>
                        <div className="bg-blue-50 p-3 rounded-md">
                          <div className="flex items-start space-x-2">
                            <CalendarIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-blue-700">
                                {format(startDate, "MMMM dd")} - {format(endDate, "MMMM dd, yyyy")}
                              </p>
                              <p className="text-sm text-blue-600">
                                {nightsCount} nights
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex">
                            <Button
                              type="button"
                              className="w-full"
                              onClick={handleCheckAvailability}
                              disabled={isCheckingAvailability}
                            >
                              {isCheckingAvailability ? "Checking..." : "Check Availability"}
                            </Button>
                          </div>
                          
                          {isDateRangeAvailable !== null && (
                            <div className={`mt-2 text-center text-sm ${isDateRangeAvailable ? 'text-green-600' : 'text-red-600'}`}>
                              {isDateRangeAvailable ? "✓ Available for booking" : "✗ Not available for the selected dates"}
                            </div>
                          )}
                        </div>
                        
                        {isDateRangeAvailable && (
                          <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">
                                {formatCurrency(apartment.price)} DH x {nightsCount} nights
                              </span>
                              <span className="font-medium">
                                {formatCurrency(totalPrice)} DH
                              </span>
                            </div>
                            
                            <div className="flex justify-between pt-3 border-t font-semibold">
                              <span>Total</span>
                              <span>{formatCurrency(totalPrice)} DH</span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {isDateRangeAvailable && (
                      <div className="space-y-4 pt-2">
                        <div>
                          <label htmlFor="normalName" className="text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <Input
                            id="normalName"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter your full name"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="normalEmail" className="text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <Input
                            id="normalEmail"
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="Enter your email"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="normalPhone" className="text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <Input
                            id="normalPhone"
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            placeholder="Enter your phone number"
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={!startDate || !endDate || !isDateRangeAvailable || !userName || !userEmail || !userPhone}
                        >
                          Reserve
                        </Button>
                      </div>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApartmentDetails;
