export default function EmptyState({ message, icon = "📭" }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-4">{icon}</div>
        <p className="text-white/80 text-xl">
          {message || 'No data available'}
        </p>
      </div>
    </div>
  );
}