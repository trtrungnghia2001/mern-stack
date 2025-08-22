import { DataTableComponent } from "@/shared/components/form/data-table-component";
import { Button } from "@/shared/components/ui/button";
import useSearchParamsValue from "@/shared/hooks/useSearchParamsValue";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { ArrowUpDown } from "lucide-react";
import { memo, useEffect, useState } from "react";

export interface IProductList {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

const ProductDatatable = () => {
  const { searchParams, handleSearchParams } = useSearchParamsValue();

  const productColumn: ColumnDef<IProduct>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => (
        <div className="w-10 aspect-square mx-auto">
          <img src={row.original.thumbnail} alt="thumbnail" loading="lazy" />
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      minSize: 300,
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-2 w-4 aspect-square" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(row.original.price)}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "rating",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rating
            <ArrowUpDown className="ml-2 w-4 aspect-square" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.original.rating}</div>
      ),
    },
    {
      accessorKey: "tags",
      header: "Tags",
    },
  ];

  const productPage = Number(searchParams.get("productPage")) || 1;
  const getProductsResult = useQuery({
    queryKey: ["product", productPage],
    queryFn: async () =>
      axios.get<IProductList>(
        `https://dummyjson.com/products?limit=10&skip=${(productPage - 1) * 10}`
      ),
  });

  const [products, setProducts] = useState<IProduct[]>([]);
  useEffect(() => {
    if (getProductsResult.isSuccess && getProductsResult.data) {
      setProducts(getProductsResult.data.data.products);
    }
  }, [getProductsResult.isSuccess, getProductsResult.data]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl w-full">
      <DataTableComponent
        isLoading={getProductsResult.isLoading}
        columns={productColumn}
        data={products}
        pagination={{
          currentPage: productPage,
          onPageChange(page) {
            handleSearchParams("productPage", page.toString());
          },
          totalPages: getProductsResult.data?.data.total
            ? Math.ceil(getProductsResult.data?.data.total / 10)
            : 0,
        }}
        isSelect
        onSelect={(rows) => {
          console.log(rows);
        }}
        isDragAndDrop
        onDragAndDrop={(newData) => {
          console.log({ newData });
        }}
        isExportCSV
      />
    </div>
  );
};

export default memo(ProductDatatable);
