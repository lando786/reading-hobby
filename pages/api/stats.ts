import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // @ts-ignore
    const userId = session.user.id;

    if (req.method === 'GET') {
        try {
            const stats = await prisma.userStats.findUnique({
                where: { userId },
            });
            return res.status(200).json(stats || {});
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch stats" });
        }
    }

    if (req.method === 'POST') {
        const data = req.body;
        try {
            const stats = await prisma.userStats.upsert({
                where: { userId },
                update: {
                    xp: data.xp,
                    level: data.level,
                    streak: data.streak,
                    lastReadDate: data.lastReadDate,
                    read20Pages: data.dailyQuests?.read20Pages,
                    read20Mins: data.dailyQuests?.read20Mins,
                    finishChapter: data.dailyQuests?.finishChapter,
                    pagesReadToday: data.pagesReadToday,
                    lastQuestReset: data.lastQuestReset,
                },
                create: {
                    userId,
                    xp: data.xp,
                    level: data.level,
                    streak: data.streak,
                    lastReadDate: data.lastReadDate,
                    read20Pages: data.dailyQuests?.read20Pages,
                    read20Mins: data.dailyQuests?.read20Mins,
                    finishChapter: data.dailyQuests?.finishChapter,
                    pagesReadToday: data.pagesReadToday,
                    lastQuestReset: data.lastQuestReset,
                },
            });
            return res.status(200).json(stats);
        } catch (error) {
            return res.status(500).json({ error: "Failed to save stats" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
