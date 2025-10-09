import { Search } from "lucide-react";
import type { ComponentProps, FC } from "react";

const InputSearch: FC<ComponentProps<"input">> = ({
  placeholder = "Search...",
  ...props
}) => {
  return (
    <div className="flex items-center border rounded-full overflow-hidden px-3 py-1.5 ring-0 focus:ring-1 focus-within:ring-blue-500 transition">
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 border-none outline-none bg-transparent text-sm"
        {...props}
      />
      <div className="ml-2 text-gray-400">
        <Search size={16} />
      </div>
    </div>
  );
};

export default InputSearch;
