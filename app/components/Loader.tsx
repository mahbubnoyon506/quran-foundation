// components/Loader.tsx
export default function Loader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
    </div>
  );
}
