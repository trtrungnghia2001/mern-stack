import PaginationComponent from "@/shared/components/form/pagination-component";
import useSearchParamsValue from "@/shared/hooks/useSearchParamsValue";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { memo } from "react";
interface IPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

const PostList = () => {
  const { searchParams, handleSearchParams } = useSearchParamsValue();
  const postPage = Number(searchParams.get("postPage")) || 1;
  const getPostsResult = useQuery({
    queryKey: ["posts", postPage],
    queryFn: async () =>
      axios.get<IPost[]>(
        `https://jsonplaceholder.typicode.com/posts?_page=${postPage}&_limit=10`
      ),
  });
  return (
    <div className="bg-white p-4 rounded-lg shadow-xl w-full">
      {getPostsResult.isLoading && <div>Dang tai bai viet...</div>}
      <ul>
        {getPostsResult.data?.data.map((post) => (
          <li
            key={post.id}
            className="py-4 border-b last:mb-4 hover:bg-gray-50"
          >
            <h5 dangerouslySetInnerHTML={{ __html: post.title }}></h5>
            <p dangerouslySetInnerHTML={{ __html: post.body }}></p>
          </li>
        ))}
      </ul>
      <PaginationComponent
        currentPage={postPage}
        onPageChange={(page) => handleSearchParams("postPage", page.toString())}
        totalPages={10}
      />
    </div>
  );
};

export default memo(PostList);
