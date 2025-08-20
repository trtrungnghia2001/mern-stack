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
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Loader2 } from "lucide-react";
import type { PaginationComponentProps } from "../pagination-component";
import PaginationComponent from "../pagination-component";
import { Checkbox } from "../../ui/checkbox";
import { exportToCSV } from "./utils/csv";
import DragAndDropComponent from "./components/DragAndDropComponent";
import SortableRow, { DragHandle } from "./components/SortableRow";
import { Button } from "../../ui/button";

type WithId = { id: string };

export interface DataTableComponentProps<TData extends WithId, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  pagination?: PaginationComponentProps;
  isSelect?: boolean;
  onSelect?: (rows: TData[]) => void;
  isDragAndDrop?: boolean;
  onDragAndDrop?: (rows: TData[]) => void;
  isExportCSV?: boolean;
}

const selectColumnKey = "data-table-select";
const dragColumnKey = "data-table-drag-and-drop";
export function DataTableComponent<TData extends WithId, TValue>({
  columns,
  data,
  isLoading,
  pagination,
  isSelect,
  onSelect,
  isDragAndDrop,
  onDragAndDrop,
  isExportCSV,
}: DataTableComponentProps<TData, TValue>) {
  // config
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const selectColumn: ColumnDef<TData, unknown> = {
    id: selectColumnKey,
    header: ({ table }: HeaderContext<TData, unknown>) => (
      <Checkbox
        className="mx-2"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
  };
  const dragColumn: ColumnDef<TData, unknown> = {
    id: dragColumnKey,
    enableSorting: false,
    enableHiding: false,
  };

  const table = useReactTable({
    data,
    columns: [dragColumn, selectColumn, ...columns],
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
      columnVisibility: {
        selectColumnKey: !!isSelect,
        dragColumnKey: !!isDragAndDrop,
      },
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

  //   csv
  const handleExportCSV = () => {
    const selected = table.getSelectedRowModel().rows.map((r) => r.original);

    if (selected.length === 0) {
      alert("Vui lòng chọn ít nhất một dòng để export.");
      return;
    }

    exportToCSV(selected as Record<string, unknown>[], "selected-rows.csv");
  };

  return (
    <div className="space-y-5">
      {/* table */}
      <div className="overflow-x-auto rounded-md border">
        <DragAndDropComponent
          onDragEnd={(newData) => onDragAndDrop?.(newData as TData[])}
          data={data}
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
                    {(attributes, listeners) =>
                      row
                        .getVisibleCells()
                        .map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.column.id === dragColumnKey ? (
                              <DragHandle
                                attributes={attributes}
                                listeners={listeners}
                              />
                            ) : (
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )
                            )}
                          </TableCell>
                        ))
                    }
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
        </DragAndDropComponent>
      </div>
      {/* footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-end gap-4">
          <span className="text-gray-500 text-sm">
            {table.getSelectedRowModel().rows.length} of {data.length} row(s)
            selected.
          </span>
          {isExportCSV && (
            <Button variant="link" size="sm" onClick={() => handleExportCSV()}>
              Export CSV
            </Button>
          )}
        </div>
        <div className="flex items-center justify-end gap-4">
          {pagination && <PaginationComponent {...pagination} size="sm" />}
        </div>
      </div>
    </div>
  );
}
