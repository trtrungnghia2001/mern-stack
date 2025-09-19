import instance from "@/configs/axios.config";
import type { ResponseSuccessListType } from "@/shared/types/response";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { IMemberDetail } from "../types/member.type";
import MemberDetailCard from "../components/MemberDetailCard";
import Loading from "../components/Loading";
import ErrorPage from "./ErrorPage";
import useSearchParamsValue from "@/shared/hooks/useSearchParamsValue";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

const MemberPage = () => {
  const { searchParams, handleSearchParams } = useSearchParamsValue();
  const [value, setValue] = useState("");
  const q = searchParams.get("_q") || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["member", q],
    queryFn: async () =>
      (
        await instance.get<ResponseSuccessListType<IMemberDetail>>(
          `/api/v1/kanban/member/get-all`,
          {
            params: {
              _q: q,
            },
          }
        )
      ).data,
  });
  useEffect(() => {
    setValue(q);
  }, [q]);

  useEffect(() => {
    if (value === q) return;
    const timer = setTimeout(() => {
      handleSearchParams("_q", value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value, q]);

  if (isLoading) return <Loading />;
  if (error) return <ErrorPage />;

  return (
    <div>
      <form
        className="flex items-stretch gap-3 mb-6"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Input
          placeholder="Search..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>
      <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.data.map((item) => (
          <li key={item._id}>
            <MemberDetailCard data={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberPage;
