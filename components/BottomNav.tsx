import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, BookOpen, Scroll, User } from 'lucide-react';
import clsx from 'clsx';

export default function BottomNav() {
    const router = useRouter();

    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/library', label: 'Library', icon: BookOpen },
        { href: '/quests', label: 'Quests', icon: Scroll },
        { href: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[var(--background)] border-t-2 border-[var(--foreground)] h-20 pb-2 flex justify-around items-center z-50 rounded-t-[15px]">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = router.pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(
                            "flex flex-col items-center justify-center p-2 w-16 transition-transform active:scale-95",
                            isActive ? "text-[var(--primary)] -translate-y-1" : "text-gray-500 hover:text-[var(--foreground)]"
                        )}
                    >
                        <Icon size={28} strokeWidth={isActive ? 2.5 : 2} className={clsx(isActive && "drop-shadow-sm")} />
                        <span className="text-xs mt-1 font-bold">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
