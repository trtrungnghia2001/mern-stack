import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { FileDown } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/axios.config";
import type { IDashboardOverview } from "../types/dashboard.type";
import Loading from "../components/Loading";
import ErrorPage from "./ErrorPage";
import type { ResponseSuccessType } from "@/shared/types/response";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";

const DashboardPage = () => {
  const COLORS = ["#60a5fa", "#34d399", "#f87171", "#9ca3af"];

  const { data, error, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () =>
      (
        await instance.get<ResponseSuccessType<IDashboardOverview>>(
          `/api/v1/kanban/dashboard/overview`
        )
      ).data.data,
  });

  const handleExport = async () => {
    try {
      const response = await instance.get("/api/v1/kanban/dashboard/export", {
        responseType: "blob", // nhận dữ liệu dạng nhị phân
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "kanban_export.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  if (isLoading) return <Loading />;

  if (error || !data) return <ErrorPage />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={handleExport} size={"sm"}>
          <FileDown />
          Export
        </Button>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500">Boards</p>
            <h2 className="text-xl font-bold">{data.summary.boards}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500">Tasks</p>
            <h2 className="text-xl font-bold">{data.summary.tasks}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500">Completed</p>
            <h2 className="text-xl font-bold">{data.summary.completed}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500">Overdue</p>
            <h2 className="text-xl font-bold text-red-500">
              {data.summary.overdue}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-base font-semibold mb-4">Task by Status</h3>
            <PieChart width={300} height={250} className="mx-auto">
              <Pie
                data={data.statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                dataKey="value"
              >
                {data.statusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-base font-semibold mb-4">Task by Board</h3>
            <BarChart
              width={350}
              height={250}
              data={data.boardData}
              className="mx-auto"
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" fill="#60a5fa" />
            </BarChart>
          </CardContent>
        </Card>
      </div>

      {/* Recent Boards */}
      <Card>
        <CardContent className="p-4  w-full overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Board overview</h3>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableCell>Board</TableCell>
                <TableCell>Total column</TableCell>
                <TableCell>Total task</TableCell>
                <TableCell>In Progress</TableCell>
                <TableCell>Completed</TableCell>
                <TableCell>Overdue</TableCell>
                <TableCell>Last Updated</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.boardOverview.map((b) => (
                <TableRow key={b._id}>
                  <TableCell>{b.name}</TableCell>
                  <TableCell>{b.columnsCount}</TableCell>
                  <TableCell>{b.tasksCount}</TableCell>
                  <TableCell className="text-yellow-600">
                    {b.inProgress}
                  </TableCell>
                  <TableCell className="text-green-600">
                    {b.completed}
                  </TableCell>
                  <TableCell className="text-red-600">{b.overdue}</TableCell>
                  <TableCell>
                    {new Date(b.updatedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
