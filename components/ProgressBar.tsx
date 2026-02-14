export default function ProgressBar({ current, total, color = 'bg-[var(--accent)]' }: { current: number; total: number; color?: string }) {
    const percentage = Math.min(100, Math.max(0, (current / (total || 1)) * 100)); // Avoid division by zero

    return (
        <div className="w-full h-6 border-2 border-[var(--foreground)] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] overflow-hidden relative bg-white shadow-sm">
            <div
                className={`h-full ${color} border-r-2 border-[var(--foreground)] transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold pointer-events-none">
                {current} / {total}
            </div>
        </div>
    );
}
