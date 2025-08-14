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
import { Grip, Loader2 } from "lucide-react";
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: IPaginationComponentProps;
  isSelect?: boolean;
  onSelect?: (rows: TData[]) => void;
  isLoading?: boolean;
  isDragAndDrop?: boolean;
  onDragEnd?: (newData: TData[]) => void;
}

export function DataTableComponent<TData, TValue>({
  columns,
  data,
  pagination,
  isSelect,
  onSelect,
  isLoading,
  isDragAndDrop,
  onDragEnd,
}: DataTableProps<TData, TValue>) {
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

  // dnd
  const dragColumn = useMemo(() => {
    return isDragAndDrop
      ? [
          {
            id: "drag",
            header: "",
            cell: ({ row }: { row: Row<TData> }) => {
              return (
                <div>
                  <Grip className="w-4 h-4 text-muted-foreground cursor-move" />
                </div>
              );
            },
            enableSorting: false,
            enableHiding: false,
          },
        ]
      : [];
  }, [isDragAndDrop]);

  const table = useReactTable({
    data,
    columns: [...dragColumn, ...selectColumn, ...columns],
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

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
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
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={(event: DragEndEvent) => {
                  const { active, over } = event;
                  if (active.id !== over?.id) {
                    const oldIndex = table
                      .getRowModel()
                      .rows.findIndex((r) => r.id === active.id);
                    const newIndex = table
                      .getRowModel()
                      .rows.findIndex((r) => r.id === over?.id);

                    const newData = arrayMove(data, oldIndex, newIndex);
                    onDragEnd?.(newData);
                  }
                }}
              >
                <SortableContext
                  items={table.getRowModel().rows.map((r) => r.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <TableRow key={row.id}>
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
                      </TableRow>
                    );
                  })}
                </SortableContext>
              </DndContext>
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
      </div>
      {pagination && (
        <div className="flex justify-end">
          <PaginationComponent {...pagination} />
        </div>
      )}
    </div>
  );
}
