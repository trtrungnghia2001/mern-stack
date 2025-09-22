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
import { RenderList } from "../components/RenderList";

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

  const handleSearch = () => {
    if (value === q) return;
    handleSearchParams("_q", value);
  };

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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button type="submit" onClick={handleSearch}>
          Search
        </Button>
      </form>
      <RenderList
        items={data?.data || []}
        renderItem={(item) => <MemberDetailCard data={item} />}
      />
    </div>
  );
};

export default MemberPage;
