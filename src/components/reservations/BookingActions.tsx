
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

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

interface BookingActionsProps {
  booking: BookingData;
  type: "period" | "normal";
  onDelete: (id: string) => Promise<{ success: boolean; error?: any }>;
  onUpdate: (id: string, updates: any) => Promise<{ success: boolean; error?: any }>;
}

const BookingActions: React.FC<BookingActionsProps> = ({
  booking,
  type,
  onDelete,
  onUpdate
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    userName: booking.userName,
    userEmail: booking.userEmail,
    userPhone: booking.userPhone
  });

  const handleDelete = async () => {
    const result = await onDelete(booking.id);
    if (result.success) {
      toast.success("Réservation supprimée avec succès");
    } else {
      toast.error("Erreur lors de la suppression de la réservation");
    }
  };

  const handleUpdate = async () => {
    const result = await onUpdate(booking.id, editData);
    if (result.success) {
      toast.success("Réservation mise à jour avec succès");
      setIsEditOpen(false);
    } else {
      toast.error("Erreur lors de la mise à jour de la réservation");
    }
  };

  return (
    <div className="flex gap-2">
      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la réservation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="userName">Nom</Label>
              <Input
                id="userName"
                value={editData.userName}
                onChange={(e) => setEditData(prev => ({ ...prev, userName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="userEmail">Email</Label>
              <Input
                id="userEmail"
                type="email"
                value={editData.userEmail}
                onChange={(e) => setEditData(prev => ({ ...prev, userEmail: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="userPhone">Téléphone</Label>
              <Input
                id="userPhone"
                value={editData.userPhone}
                onChange={(e) => setEditData(prev => ({ ...prev, userPhone: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdate}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la réservation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette réservation de {booking.userName} ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingActions;
