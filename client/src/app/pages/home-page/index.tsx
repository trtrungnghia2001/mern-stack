import AccountOverviewBox from "./AccountOverviewBox";
import PostList from "./PostList";
import ProductDatatable from "./ProductDatatable";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 space-y-8">
      {/* box auth */}
      <AccountOverviewBox />
      {/* pagination */}
      <PostList />
      {/* data table */}
      <ProductDatatable />
    </div>
  );
};

export default HomePage;
