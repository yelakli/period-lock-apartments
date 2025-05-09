
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBooking } from "@/context/BookingContext";
import Layout from "@/components/Layout";
import ReservationsTable from "@/components/ReservationsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, MapPin, Plus, Edit, Trash } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    apartments,
    bookingPeriods,
    bookings,
    normalBookings,
    addApartment,
    updateApartment,
    deleteApartment,
    addBookingPeriod,
    deleteBookingPeriod,
    getApartmentBookingPeriods,
    userType,
  } = useBooking();

  // State for adding/editing apartments
  const [isAddingApartment, setIsAddingApartment] = useState(false);
  const [editingApartment, setEditingApartment] = useState<string | null>(null);
  const [apartmentForm, setApartmentForm] = useState({
    name: "",
    location: "",
    description: "",
    price: 0,
    images: ["", ""],
    bookingType: "period" as "period" | "normal",
    minNights: undefined as number | undefined,
    maxNights: undefined as number | undefined,
  });

  // State for adding booking periods
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);
  const [periodApartmentId, setPeriodApartmentId] = useState("");
  const [periodStartDate, setPeriodStartDate] = useState<Date | undefined>(undefined);
  const [periodEndDate, setPeriodEndDate] = useState<Date | undefined>(undefined);

  // Redirect if not admin
  if (userType !== "admin") {
    navigate("/");
    return null;
  }

  const handleAddApartment = () => {
    // Validate night constraints for normal booking
    if (apartmentForm.bookingType === "normal") {
      if (!apartmentForm.minNights && !apartmentForm.maxNights) {
        toast.error("Please specify at least one night constraint (minimum or maximum nights)");
        return;
      }
      
      if (apartmentForm.minNights && apartmentForm.maxNights && 
          apartmentForm.minNights > apartmentForm.maxNights) {
        toast.error("Minimum nights cannot be greater than maximum nights");
        return;
      }
    }
    
    addApartment({
      name: apartmentForm.name,
      location: apartmentForm.location,
      description: apartmentForm.description,
      price: Number(apartmentForm.price),
      images: apartmentForm.images.filter(Boolean),
      bookingType: apartmentForm.bookingType,
      minNights: apartmentForm.bookingType === "normal" ? apartmentForm.minNights : undefined,
      maxNights: apartmentForm.bookingType === "normal" ? apartmentForm.maxNights : undefined,
    });
    
    setApartmentForm({
      name: "",
      location: "",
      description: "",
      price: 0,
      images: ["", ""],
      bookingType: "period",
      minNights: undefined,
      maxNights: undefined,
    });
    
    setIsAddingApartment(false);
  };

  const handleEditApartment = () => {
    if (editingApartment) {
      // Validate night constraints for normal booking
      if (apartmentForm.bookingType === "normal") {
        if (!apartmentForm.minNights && !apartmentForm.maxNights) {
          toast.error("Please specify at least one night constraint (minimum or maximum nights)");
          return;
        }
        
        if (apartmentForm.minNights && apartmentForm.maxNights && 
            apartmentForm.minNights > apartmentForm.maxNights) {
          toast.error("Minimum nights cannot be greater than maximum nights");
          return;
        }
      }
      
      updateApartment({
        id: editingApartment,
        name: apartmentForm.name,
        location: apartmentForm.location,
        description: apartmentForm.description,
        price: Number(apartmentForm.price),
        images: apartmentForm.images.filter(Boolean),
        bookingType: apartmentForm.bookingType,
        minNights: apartmentForm.bookingType === "normal" ? apartmentForm.minNights : undefined,
        maxNights: apartmentForm.bookingType === "normal" ? apartmentForm.maxNights : undefined,
      });
      
      setEditingApartment(null);
    }
  };

  const startEditing = (apartment: any) => {
    setEditingApartment(apartment.id);
    setApartmentForm({
      name: apartment.name,
      location: apartment.location,
      description: apartment.description,
      price: apartment.price,
      images: [...apartment.images, "", ""].slice(0, 2), // Ensure we have 2 image slots
      bookingType: apartment.bookingType || "period",
      minNights: apartment.minNights,
      maxNights: apartment.maxNights,
    });
  };

  const handleAddBookingPeriod = () => {
    if (!periodApartmentId || !periodStartDate || !periodEndDate) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (periodStartDate >= periodEndDate) {
      toast.error("End date must be after start date");
      return;
    }
    
    addBookingPeriod({
      apartmentId: periodApartmentId,
      startDate: periodStartDate,
      endDate: periodEndDate,
      isBooked: false,
    });
    
    setPeriodApartmentId("");
    setPeriodStartDate(undefined);
    setPeriodEndDate(undefined);
    setIsAddingPeriod(false);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage apartments, booking periods, and view reservations.
          </p>
        </div>

        <Tabs defaultValue="apartments">
          <TabsList className="mb-6">
            <TabsTrigger value="apartments">Apartments</TabsTrigger>
            <TabsTrigger value="booking-periods">Booking Periods</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
          </TabsList>

          {/* Apartments Tab */}
          <TabsContent value="apartments">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Apartments</h2>
              <Dialog open={isAddingApartment} onOpenChange={setIsAddingApartment}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Apartment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add New Apartment</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new apartment listing.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
                        Apartment Name
                      </label>
                      <Input
                        id="name"
                        value={apartmentForm.name}
                        onChange={(e) => setApartmentForm({ ...apartmentForm, name: e.target.value })}
                        placeholder="Enter apartment name"
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1 block">
                        Location
                      </label>
                      <Input
                        id="location"
                        value={apartmentForm.location}
                        onChange={(e) => setApartmentForm({ ...apartmentForm, location: e.target.value })}
                        placeholder="Enter location"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1 block">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        value={apartmentForm.description}
                        onChange={(e) => setApartmentForm({ ...apartmentForm, description: e.target.value })}
                        placeholder="Enter apartment description"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label htmlFor="price" className="text-sm font-medium text-gray-700 mb-1 block">
                        Price per Night (Dh)
                      </label>
                      <Input
                        id="price"
                        type="number"
                        value={apartmentForm.price || ""}
                        onChange={(e) => setApartmentForm({ ...apartmentForm, price: parseFloat(e.target.value) || 0 })}
                        placeholder="Enter price per night"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Booking Type
                      </label>
                      <RadioGroup 
                        value={apartmentForm.bookingType} 
                        onValueChange={(value: "period" | "normal") => 
                          setApartmentForm({ ...apartmentForm, bookingType: value })
                        }
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="period" id="period" />
                          <label htmlFor="period" className="text-sm">Period-based booking</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="normal" />
                          <label htmlFor="normal" className="text-sm">Normal date range booking</label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {apartmentForm.bookingType === "normal" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="minNights" className="text-sm font-medium text-gray-700 mb-1 block">
                            Minimum Nights
                          </label>
                          <Input
                            id="minNights"
                            type="number"
                            value={apartmentForm.minNights ?? ""}
                            onChange={(e) => setApartmentForm({ 
                              ...apartmentForm, 
                              minNights: e.target.value ? parseInt(e.target.value) : undefined 
                            })}
                            placeholder="Min nights"
                            min="1"
                          />
                        </div>
                        <div>
                          <label htmlFor="maxNights" className="text-sm font-medium text-gray-700 mb-1 block">
                            Maximum Nights
                          </label>
                          <Input
                            id="maxNights"
                            type="number"
                            value={apartmentForm.maxNights ?? ""}
                            onChange={(e) => setApartmentForm({ 
                              ...apartmentForm, 
                              maxNights: e.target.value ? parseInt(e.target.value) : undefined 
                            })}
                            placeholder="Max nights"
                            min="1"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="images" className="text-sm font-medium text-gray-700 mb-1 block">
                        Image URLs (optional)
                      </label>
                      <div className="grid gap-2">
                        <Input
                          value={apartmentForm.images[0] || ""}
                          onChange={(e) => setApartmentForm({
                            ...apartmentForm,
                            images: [e.target.value, apartmentForm.images[1] || ""]
                          })}
                          placeholder="Enter image URL #1"
                        />
                        <Input
                          value={apartmentForm.images[1] || ""}
                          onChange={(e) => setApartmentForm({
                            ...apartmentForm,
                            images: [apartmentForm.images[0] || "", e.target.value]
                          })}
                          placeholder="Enter image URL #2"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingApartment(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddApartment}>Save Apartment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {apartments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No apartments added yet.</p>
                </div>
              ) : (
                apartments.map((apartment) => (
                  <Card key={apartment.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 bg-gray-100">
                        {apartment.images && apartment.images[0] ? (
                          <img
                            src={apartment.images[0]}
                            alt={apartment.name}
                            className="w-full h-full object-cover aspect-square md:aspect-auto"
                          />
                        ) : (
                          <div className="w-full h-full min-h-[200px] flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="md:w-3/4 p-6">
                        <div className="flex justify-between">
                          <h3 className="text-xl font-medium text-gray-900 mb-2">{apartment.name}</h3>
                          <div className="space-x-2">
                            <Dialog open={editingApartment === apartment.id} onOpenChange={(open) => {
                              if (!open) setEditingApartment(null);
                            }}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => startEditing(apartment)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[550px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Apartment</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div>
                                    <label htmlFor="edit-name" className="text-sm font-medium text-gray-700 mb-1 block">
                                      Apartment Name
                                    </label>
                                    <Input
                                      id="edit-name"
                                      value={apartmentForm.name}
                                      onChange={(e) => setApartmentForm({ ...apartmentForm, name: e.target.value })}
                                      placeholder="Enter apartment name"
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor="edit-location" className="text-sm font-medium text-gray-700 mb-1 block">
                                      Location
                                    </label>
                                    <Input
                                      id="edit-location"
                                      value={apartmentForm.location}
                                      onChange={(e) => setApartmentForm({ ...apartmentForm, location: e.target.value })}
                                      placeholder="Enter location"
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor="edit-description" className="text-sm font-medium text-gray-700 mb-1 block">
                                      Description
                                    </label>
                                    <Textarea
                                      id="edit-description"
                                      value={apartmentForm.description}
                                      onChange={(e) => setApartmentForm({ ...apartmentForm, description: e.target.value })}
                                      placeholder="Enter apartment description"
                                      rows={4}
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor="edit-price" className="text-sm font-medium text-gray-700 mb-1 block">
                                      Price per Night (Dh)
                                    </label>
                                    <Input
                                      id="edit-price"
                                      type="number"
                                      value={apartmentForm.price || ""}
                                      onChange={(e) => setApartmentForm({ ...apartmentForm, price: parseFloat(e.target.value) || 0 })}
                                      placeholder="Enter price per night"
                                      min="0"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                      Booking Type
                                    </label>
                                    <RadioGroup 
                                      value={apartmentForm.bookingType} 
                                      onValueChange={(value: "period" | "normal") => 
                                        setApartmentForm({ ...apartmentForm, bookingType: value })
                                      }
                                      className="flex gap-4"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="period" id="edit-period" />
                                        <label htmlFor="edit-period" className="text-sm">Period-based booking</label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="normal" id="edit-normal" />
                                        <label htmlFor="edit-normal" className="text-sm">Normal date range booking</label>
                                      </div>
                                    </RadioGroup>
                                  </div>
                                  
                                  {apartmentForm.bookingType === "normal" && (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label htmlFor="edit-minNights" className="text-sm font-medium text-gray-700 mb-1 block">
                                          Minimum Nights
                                        </label>
                                        <Input
                                          id="edit-minNights"
                                          type="number"
                                          value={apartmentForm.minNights ?? ""}
                                          onChange={(e) => setApartmentForm({ 
                                            ...apartmentForm, 
                                            minNights: e.target.value ? parseInt(e.target.value) : undefined 
                                          })}
                                          placeholder="Min nights"
                                          min="1"
                                        />
                                      </div>
                                      <div>
                                        <label htmlFor="edit-maxNights" className="text-sm font-medium text-gray-700 mb-1 block">
                                          Maximum Nights
                                        </label>
                                        <Input
                                          id="edit-maxNights"
                                          type="number"
                                          value={apartmentForm.maxNights ?? ""}
                                          onChange={(e) => setApartmentForm({ 
                                            ...apartmentForm, 
                                            maxNights: e.target.value ? parseInt(e.target.value) : undefined 
                                          })}
                                          placeholder="Max nights"
                                          min="1"
                                        />
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div>
                                    <label htmlFor="edit-images" className="text-sm font-medium text-gray-700 mb-1 block">
                                      Image URLs
                                    </label>
                                    <div className="grid gap-2">
                                      <Input
                                        value={apartmentForm.images[0] || ""}
                                        onChange={(e) => setApartmentForm({
                                          ...apartmentForm,
                                          images: [e.target.value, apartmentForm.images[1] || ""]
                                        })}
                                        placeholder="Enter image URL #1"
                                      />
                                      <Input
                                        value={apartmentForm.images[1] || ""}
                                        onChange={(e) => setApartmentForm({
                                          ...apartmentForm,
                                          images: [apartmentForm.images[0] || "", e.target.value]
                                        })}
                                        placeholder="Enter image URL #2"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setEditingApartment(null)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleEditApartment}>Save Changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this apartment?")) {
                                  deleteApartment(apartment.id);
                                  toast.success("Apartment deleted successfully!");
                                }
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-start space-x-1 text-gray-600 text-sm mb-2">
                          <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <span>{apartment.location}</span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{apartment.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{apartment.price} Dh per night</span>
                          <div className="flex flex-col items-end">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              apartment.bookingType === 'normal' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {apartment.bookingType === 'normal' ? 'Normal booking' : 'Period booking'}
                            </span>
                            {apartment.bookingType === 'normal' && (
                              <span className="text-xs text-gray-500 mt-1">
                                {apartment.minNights && apartment.maxNights ? 
                                  `${apartment.minNights}-${apartment.maxNights} nights` : 
                                  apartment.minNights ? 
                                    `Min: ${apartment.minNights} nights` : 
                                    apartment.maxNights ? 
                                      `Max: ${apartment.maxNights} nights` : ""}
                              </span>
                            )}
                            {apartment.bookingType === 'period' && (
                              <span className="text-xs text-gray-500 mt-1">
                                {getApartmentBookingPeriods(apartment.id).filter(p => !p.isBooked).length} periods available
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Booking Periods Tab */}
          <TabsContent value="booking-periods">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Booking Periods</h2>
              <Dialog open={isAddingPeriod} onOpenChange={setIsAddingPeriod}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Booking Period
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add New Booking Period</DialogTitle>
                    <DialogDescription>
                      Set available dates for an apartment.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Select Apartment
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={periodApartmentId}
                        onChange={(e) => setPeriodApartmentId(e.target.value)}
                      >
                        <option value="">Select an apartment</option>
                        {apartments
                          .filter(apt => apt.bookingType === 'period')
                          .map((apt) => (
                            <option key={apt.id} value={apt.id}>
                              {apt.name} - {apt.bookingType === 'period' ? 'Period booking' : 'Normal booking'}
                            </option>
                          ))}
                      </select>
                      {periodApartmentId && apartments.find(apt => apt.id === periodApartmentId)?.bookingType !== 'period' && (
                        <p className="text-red-500 text-sm mt-1">
                          Periods can only be added to apartments with "Period booking" type.
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Start Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !periodStartDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {periodStartDate ? format(periodStartDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 pointer-events-auto">
                            <Calendar
                              mode="single"
                              selected={periodStartDate}
                              onSelect={setPeriodStartDate}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          End Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !periodEndDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {periodEndDate ? format(periodEndDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 pointer-events-auto">
                            <Calendar
                              mode="single"
                              selected={periodEndDate}
                              onSelect={setPeriodEndDate}
                              initialFocus
                              disabled={(date) => periodStartDate ? date < periodStartDate : false}
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingPeriod(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddBookingPeriod} disabled={!periodApartmentId || apartments.find(apt => apt.id === periodApartmentId)?.bookingType !== 'period'}>
                      Add Period
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {apartments.filter(apt => apt.bookingType === 'period').length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No apartments with period booking type added yet.</p>
              </div>
            ) : (
              apartments
                .filter(apt => apt.bookingType === 'period')
                .map((apartment) => {
                  const periods = getApartmentBookingPeriods(apartment.id);
                  
                  return (
                    <Card key={apartment.id} className="mb-6">
                      <CardHeader>
                        <CardTitle>{apartment.name}</CardTitle>
                        <CardDescription>{apartment.location}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {periods.length === 0 ? (
                          <div className="text-center py-6 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No booking periods added for this apartment.</p>
                          </div>
                        ) : (
                          <div className="divide-y">
                            {periods.map((period) => (
                              <div key={period.id} className="py-3 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                                  <span>
                                    {format(new Date(period.startDate), "MMM dd")} - {format(new Date(period.endDate), "MMM dd, yyyy")}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className={`px-2 py-1 text-xs font-medium rounded ${period.isBooked ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                                    {period.isBooked ? "Booked" : "Available"}
                                  </span>
                                  {!period.isBooked && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        if (confirm("Are you sure you want to delete this booking period?")) {
                                          deleteBookingPeriod(period.id);
                                          toast.success("Booking period deleted successfully!");
                                        }
                                      }}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setPeriodApartmentId(apartment.id);
                            setIsAddingPeriod(true);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Period for {apartment.name}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })
            )}
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations">
            <h2 className="text-xl font-semibold mb-6">Manage Reservations</h2>

            {bookings.length === 0 && normalBookings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No reservations have been made yet.</p>
              </div>
            ) : (
              <ReservationsTable 
                bookings={bookings}
                normalBookings={normalBookings}
                apartments={apartments}
                bookingPeriods={bookingPeriods}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
