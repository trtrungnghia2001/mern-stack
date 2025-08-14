import React, { memo } from "react";
import { Button } from "../../ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

export interface IPaginationComponentProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  maxPageNumbersToShow?: number; // default = 5
}

type PageItem = number | string | { type: "first" | "last" };

const PaginationComponent: React.FC<IPaginationComponentProps> = ({
  currentPage,
  onPageChange,
  totalPages,
  maxPageNumbersToShow = 5,
}) => {
  const generatePageNumbers = (): PageItem[] => {
    const pages: PageItem[] = [];

    const half = Math.floor(maxPageNumbersToShow / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(currentPage + half, totalPages);

    if (end - start + 1 < maxPageNumbersToShow) {
      if (start === 1) {
        end = Math.min(start + maxPageNumbersToShow - 1, totalPages);
      } else if (end === totalPages) {
        start = Math.max(end - maxPageNumbersToShow + 1, 1);
      }
    }

    if (start > 1) {
      pages.push({ type: "first" });
      if (start > 2) {
        pages.push("...");
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push("...");
      }
      pages.push({ type: "last" });
    }

    return pages;
  };

  const pageItems = generatePageNumbers();

  const handleClick = (item: PageItem) => {
    if (typeof item === "number") {
      onPageChange(item);
    } else if (typeof item === "object") {
      if (item.type === "first") {
        onPageChange(1);
      } else if (item.type === "last") {
        onPageChange(totalPages);
      }
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {pageItems.map((item, idx) => (
        <Button
          key={idx}
          variant={
            typeof item === "number" && item === currentPage
              ? "default"
              : typeof item === "number"
              ? "outline"
              : "ghost"
          }
          onClick={() => handleClick(item)}
          className="px-3 text-sm"
          disabled={item === "..."}
        >
          {typeof item === "object" ? (
            item.type === "first" ? (
              <ChevronsLeft className="h-4 w-4" />
            ) : (
              <ChevronsRight className="h-4 w-4" />
            )
          ) : (
            item
          )}
        </Button>
      ))}
    </div>
  );
};

export default memo(PaginationComponent);
