import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
                orderBy: {
                    name: 'asc',
                },
            });
            return res.status(200).json(users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
    }

    if (req.method === 'POST') {
        const { name } = req.body;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Name is required' });
        }

        try {
            // Create a new user with default stats
            const user = await prisma.user.create({
                data: {
                    name,
                    // Initialize stats for the new user
                    stats: {
                        create: {}
                    }
                },
            });
            return res.status(201).json(user);
        } catch (error) {
            console.error('Failed to create user:', error);
            return res.status(500).json({ error: 'Failed to create user' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
