import { useUser } from '@/contexts/UserContext';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DailyQuests() {
    const { stats, completeQuest } = useUser();

    const handleComplete = (questId: keyof typeof stats.dailyQuests) => {
        if (stats.dailyQuests[questId]) return;
        completeQuest(questId);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const quests = [
        { id: 'read20Pages', label: 'Read 20 Pages', xp: 50 },
        { id: 'read20Mins', label: 'Read 20 Minutes', xp: 50 },
        { id: 'finishChapter', label: 'Finish a Chapter', xp: 50 },
    ] as const;

    return (
        <div className="sketchy-box p-5 bg-white">
            <h3 className="text-lg font-bold mb-3 border-b-2 border-[var(--secondary)] inline-block transform -rotate-1">
                Daily Quests
            </h3>
            <ul className="flex flex-col gap-3">
                {quests.map((quest) => {
                    const isCompleted = stats.dailyQuests[quest.id];
                    return (
                        <li
                            key={quest.id}
                            onClick={() => handleComplete(quest.id)}
                            className={clsx(
                                "flex items-center gap-3 p-3 border-2 rounded-lg shadow-sm cursor-pointer transition-all",
                                isCompleted
                                    ? "border-[var(--foreground)] opacity-50 bg-gray-50"
                                    : "border-[var(--foreground)] hover:scale-[1.02] active:scale-95 bg-white"
                            )}
                        >
                            <div className={clsx(
                                "w-6 h-6 border-2 border-[var(--foreground)] rounded flex items-center justify-center transition-colors",
                                isCompleted ? "bg-[var(--secondary)] text-white" : "bg-white"
                            )}>
                                {isCompleted && <Check size={16} strokeWidth={4} />}
                            </div>
                            <div className="flex-1">
                                <span className={clsx("font-bold", isCompleted && "line-through")}>{quest.label}</span>
                                {!isCompleted && <span className="text-xs text-[var(--primary)] ml-2">+{quest.xp} XP</span>}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
