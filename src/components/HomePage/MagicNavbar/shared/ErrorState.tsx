export default function ErrorState({ error, onRetry }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-red-500/20 border-2 border-red-500 rounded-2xl p-8 max-w-md text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-white/80 mb-6">
          {error?.message || 'Failed to load data'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}