import { useState, useRef, useEffect, memo } from "react";
import { createPortal } from "react-dom";

interface DropdownMenuProps {
  button: React.ReactNode;
  children:
    | React.ReactNode
    | ((setOpen: (open: boolean) => void) => React.ReactNode);
}

const ButtonDropdownMenu = ({ button, children }: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  // const [placement, setPlacement] = useState<
  //   "top" | "bottom" | "left" | "right"
  // >("bottom");

  const btnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !btnRef.current || !menuRef.current) return;

    const btnRect = btnRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let top = btnRect.bottom;
    let left = btnRect.left;
    // let place: typeof placement = "bottom";

    // Vertical check
    if (btnRect.bottom + menuRect.height > viewportHeight) {
      if (btnRect.top - menuRect.height >= 0) {
        top = btnRect.top - menuRect.height;
        // place = "top";
      } else {
        top = Math.max(0, viewportHeight - menuRect.height);
      }
    }

    // Horizontal check
    if (btnRect.left + menuRect.width > viewportWidth) {
      if (btnRect.right - menuRect.width >= 0) {
        left = btnRect.right - menuRect.width;
      } else {
        left = Math.max(0, viewportWidth - menuRect.width);
      }
    }

    setPosition({ top, left });
    // setPlacement(place);
  }, [open]);

  // close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // disable body scroll khi menu mở
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div ref={btnRef} onClick={() => setOpen(!open)}>
        {button}
      </div>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed bg-white border rounded shadow max-h-[500px] w-[300px] overflow-hidden overflow-y-auto z-50"
            style={{ top: position.top, left: position.left }}
          >
            {typeof children === "function" ? children(setOpen) : children}
          </div>,
          document.body
        )}
    </>
  );
};

export default memo(ButtonDropdownMenu);
