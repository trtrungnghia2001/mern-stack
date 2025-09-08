import { Search } from "lucide-react";
import React from "react";

const SearchInput = () => {
  return (
    <div className="flex items-center border rounded w-full pl-2">
      <Search size={14} />
      <input
        type="text"
        placeholder="Search..."
        className="bg-transparent border-none outline-none w-full px-2 py-1"
      />
    </div>
  );
};

export default SearchInput;
