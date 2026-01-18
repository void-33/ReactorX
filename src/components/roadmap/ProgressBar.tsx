interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="relative w-full bg-slate-100 rounded-full h-3 overflow-hidden">
      <div
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}
