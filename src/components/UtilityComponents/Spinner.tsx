const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen ">
      <div role="status" className="relative">
        <div
          className="w-28 h-28 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        ></div>
      </div>
      <p className="mt-4 text-blue-700 text-lg font-semibold italic animate-pulse">Loading...</p>
    </div>
  );
};

export default Spinner;
