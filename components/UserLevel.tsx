import { useUser } from '@/contexts/UserContext';
import { Flame } from 'lucide-react';

export default function UserLevel() {
    const { stats } = useUser();
    const nextLevelXp = 100 * Math.pow(stats.level, 1.5);
    const prevLevelXp = 100 * Math.pow(stats.level - 1, 1.5);
    const levelProgress = ((stats.xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100;

    // Fun titles based on level
    const titles = [
        "Novice Scrawler",
        "Page Turner",
        "Bookworm",
        "Library Lurker",
        "Page Warrior",
        "Chapter Champion",
        "Tome Titan",
        "Literary Legend"
    ];
    const title = titles[Math.min(stats.level - 1, titles.length - 1)];

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-[var(--foreground)] bg-white flex items-center justify-center font-bold text-xl relative overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${stats.level}`} alt="avatar" className="absolute inset-0" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg leading-none">LVL {stats.level}: {title}</h2>
                        <div className="text-xs text-gray-600 font-bold">{Math.floor(stats.xp)} / {Math.floor(nextLevelXp)} XP</div>
                    </div>
                </div>

                {stats.streak > 0 && (
                    <div className="flex flex-col items-center">
                        <Flame className="text-orange-500 animate-pulse" fill="currentColor" size={24} />
                        <span className="text-xs font-bold">{stats.streak} Day Streak!</span>
                    </div>
                )}
            </div>

            {/* XP Bar */}
            <div className="w-full h-4 border-2 border-[var(--foreground)] rounded-full bg-white relative overflow-hidden">
                <div
                    className="h-full bg-[var(--secondary)] border-r-2 border-[var(--foreground)]"
                    style={{ width: `${Math.max(5, Math.min(100, levelProgress))}%` }}
                />
            </div>
        </div>
    );
}
