export default function LoadingState() {
  return (
    <div className="h-full flex flex-col justify-center animate-pulse">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 bg-white/20 rounded-3xl"></div>
        <div className="flex-1 space-y-3">
          <div className="h-12 bg-white/20 rounded-lg w-2/3"></div>
          <div className="h-6 bg-white/20 rounded-lg w-1/2"></div>
        </div>
      </div>
      
      <div className="h-32 bg-white/20 rounded-lg mb-6"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-24 bg-white/20 rounded-lg"></div>
        <div className="h-24 bg-white/20 rounded-lg"></div>
        <div className="h-24 bg-white/20 rounded-lg"></div>
        <div className="h-24 bg-white/20 rounded-lg"></div>
      </div>
    </div>
  );
}