
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BookingsSearchProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

const BookingsSearch: React.FC<BookingsSearchProps> = ({
  searchTerm,
  onSearchTermChange,
}) => {
  return (
    <div className="relative w-full sm:w-80">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search reservations..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default BookingsSearch;
