
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBooking } from "@/context/BookingContext";
import Layout from "@/components/Layout";
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
    addApartment({
      name: apartmentForm.name,
      location: apartmentForm.location,
      description: apartmentForm.description,
      price: Number(apartmentForm.price),
      images: apartmentForm.images.filter(Boolean),
    });
    
    setApartmentForm({
      name: "",
      location: "",
      description: "",
      price: 0,
      images: ["", ""],
    });
    
    setIsAddingApartment(false);
    toast.success("Apartment added successfully!");
  };

  const handleEditApartment = () => {
    if (editingApartment) {
      updateApartment({
        id: editingApartment,
        name: apartmentForm.name,
        location: apartmentForm.location,
        description: apartmentForm.description,
        price: Number(apartmentForm.price),
        images: apartmentForm.images.filter(Boolean),
      });
      
      setEditingApartment(null);
      toast.success("Apartment updated successfully!");
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
    
    toast.success("Booking period added successfully!");
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
                        Price per Night ($)
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
                                      Price per Night ($)
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
                        <div className="flex justify-between">
                          <span className="font-medium">${apartment.price} per night</span>
                          <span className="text-sm text-gray-500">
                            {getApartmentBookingPeriods(apartment.id).filter(p => !p.isBooked).length} periods available
                          </span>
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
                        {apartments.map((apt) => (
                          <option key={apt.id} value={apt.id}>
                            {apt.name}
                          </option>
                        ))}
                      </select>
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
                    <Button onClick={handleAddBookingPeriod}>Add Period</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {apartments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No apartments added yet. Add an apartment first.</p>
              </div>
            ) : (
              apartments.map((apartment) => {
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

            {bookings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No reservations have been made yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {bookings.map((booking) => {
                  const apartment = apartments.find((a) => a.id === booking.apartmentId);
                  const period = bookingPeriods.find((p) => p.id === booking.periodId);
                  
                  if (!apartment || !period) return null;
                  
                  return (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-1">
                            <h3 className="font-semibold text-gray-900">Guest Information</h3>
                            <p className="text-gray-800">{booking.userName}</p>
                            <p className="text-gray-600">{booking.userEmail}</p>
                            <p className="text-gray-600">{booking.userPhone}</p>
                          </div>
                          <div className="md:col-span-1">
                            <h3 className="font-semibold text-gray-900">Apartment</h3>
                            <p className="text-gray-800">{apartment.name}</p>
                            <p className="text-gray-600">{apartment.location}</p>
                          </div>
                          <div className="md:col-span-1">
                            <h3 className="font-semibold text-gray-900">Dates</h3>
                            <p className="text-gray-800">
                              {format(new Date(period.startDate), "MMM dd")} - {format(new Date(period.endDate), "MMM dd, yyyy")}
                            </p>
                            <p className="text-gray-600">
                              {Math.round((new Date(period.endDate).getTime() - new Date(period.startDate).getTime()) / (1000 * 60 * 60 * 24))} nights
                            </p>
                          </div>
                          <div className="md:col-span-1">
                            <h3 className="font-semibold text-gray-900">Booking Details</h3>
                            <p className="text-gray-800">Booked on {format(new Date(booking.bookingDate), "MMM dd, yyyy")}</p>
                            <p className="text-gray-600">Booking #{booking.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
