import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type HeaderContext,
  type Row,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import PaginationComponent, {
  type IPaginationComponentProps,
} from "../pagination-component";
import { useEffect, useMemo, useState } from "react";
import { Checkbox } from "../../ui/checkbox";
import { Loader2 } from "lucide-react";
import { DragHandle } from "./components/DragHandle";
import SortableRow from "./components/SortableRow";
import DndWrapper from "./components/DndWrapper";
import { Button } from "../../ui/button";
import { exportToCSV } from "./utils/export";

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: IPaginationComponentProps;
  isSelect?: boolean;
  onSelect?: (rows: TData[]) => void;
  isLoading?: boolean;
  isDragAndDrop?: boolean;
  onDragEnd?: (newData: TData[]) => void;
}

export function DataTableComponent<TData extends { id: string }, TValue>({
  columns,
  data,
  pagination,
  isSelect,
  onSelect,
  isLoading,
  isDragAndDrop,
  onDragEnd,
}: DataTableProps<TData, TValue>) {
  // config
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const selectColumn = useMemo(() => {
    return isSelect
      ? [
          {
            id: "select",
            header: ({ table }: HeaderContext<TData, unknown>) => (
              <Checkbox
                className="mx-2"
                checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            ),
            cell: ({ row }: { row: Row<TData> }) => (
              <Checkbox
                className="mx-2"
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            ),
            enableSorting: false,
            enableHiding: false,
          },
        ]
      : [];
  }, [isSelect]);

  const dragColumn = useMemo(() => {
    return isDragAndDrop
      ? [
          {
            id: "drag",
            header: "",
            cell: ({ row }: { row: Row<TData> }) => <DragHandle id={row.id} />,
            enableSorting: false,
            enableHiding: false,
          },
        ]
      : [];
  }, [isDragAndDrop]);

  const table = useReactTable({
    data,
    columns: [...dragColumn, ...selectColumn, ...columns],
    getRowId: (row) => String(row.id),
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  // Gọi onSelect khi rowSelection thay đổi
  useEffect(() => {
    if (onSelect) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onSelect(selectedRows);
    }
  }, [rowSelection]);

  // dnd
  // csv
  const handleExportCSV = () => {
    const selected = table.getSelectedRowModel().rows.map((r) => r.original);

    if (selected.length === 0) {
      alert("Vui lòng chọn ít nhất một dòng để export.");
      return;
    }

    exportToCSV(selected as Record<string, unknown>[], "selected-rows.csv");
  };
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <DndWrapper
          data={data}
          onDragEnd={(value) => {
            if (onDragEnd) {
              onDragEnd(value as unknown as TData[]);
            }
          }}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          minWidth: header.column.columnDef.minSize,
                          maxWidth: header.column.columnDef.maxSize,
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <Loader2 className="animate-spin mx-auto h-6 w-6 text-gray-600" />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <SortableRow key={row.id} id={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </SortableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndWrapper>
      </div>
      {/* footer */}
      <div className="flex items-center justify-between">
        {/* left */}
        <div className="space-x-2">
          <span className="text-gray-500 text-sm">
            {table.getSelectedRowModel().rows.length} of {data.length} row(s)
            selected.
          </span>

          <Button variant="outline" size="sm" onClick={() => handleExportCSV()}>
            Export CSV
          </Button>
        </div>
        {/* right */}
        <div>
          {pagination && (
            <div className="flex justify-end">
              <PaginationComponent {...pagination} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
