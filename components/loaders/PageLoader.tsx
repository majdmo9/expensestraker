import Loader from "./LargeLoader";

const PageLoader = () => {
  return (
    <main className="min-h-screen absolute top-0 left-0 w-full flex items-center justify-center">
      <Loader />
    </main>
  );
};

export default PageLoader;
