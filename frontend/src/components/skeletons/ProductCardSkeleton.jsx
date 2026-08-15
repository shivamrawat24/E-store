const ProductCardSkeleton = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="aspect-square w-full bg-gray-200" />
      <div className="space-y-2.5 p-4">
        <div className="h-3.5 w-3/4 rounded bg-gray-200" />
        <div className="h-3.5 w-1/2 rounded bg-gray-200" />
        <div className="h-5 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
