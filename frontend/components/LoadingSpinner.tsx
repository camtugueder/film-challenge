export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12" role="status">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
