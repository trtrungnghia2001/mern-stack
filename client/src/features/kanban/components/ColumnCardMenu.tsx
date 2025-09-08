import { Ellipsis } from "lucide-react";
import React, { memo, useState } from "react";
import { cloumnBgColor } from "../constants/color";

const ColumnCardMenu = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button className="hover:bg-gray-400/50 p-2 rounded-lg">
        <Ellipsis size={16} />
      </button>
      {open && (
        <div
          className="z-10 w-[300px] border rounded-lg shadow absolute top-0 left-0"
          style={{
            backgroundColor: cloumnBgColor[0],
          }}
        >
          <div className="font-medium text-center p-5">Operation</div>
          <ul>
            {Array(3)
              .fill(0)
              .map((item) => (
                <li key={item}>
                  <button className="block w-full px-3 py-1.5 text-left hover:bg-gray-200">
                    Copy list
                  </button>
                </li>
              ))}
          </ul>

          <div className="border-t mt-2 py-2 px-3 space-y-2">
            <div className="font-semibold text-xs">Change list color</div>
            <ul className="grid grid-cols-5 gap-2">
              {cloumnBgColor.slice(1, 11).map((item) => (
                <li
                  key={item}
                  className="h-10 rounded-lg"
                  style={{ backgroundColor: item }}
                ></li>
              ))}
            </ul>
            <button className="bg-gray-200 rounded-lg px-3 py-2 w-full font-medium text-gray-500">
              Remove color
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ColumnCardMenu);
