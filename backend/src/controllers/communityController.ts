import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: { ecoPoints: 'desc' },
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        ecoPoints: true,
        role: true,
        businessProfile: {
          select: { businessName: true }
        }
      }
    });

    res.json(topUsers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRewards = async (req: Request, res: Response) => {
  try {
    // If no rewards exist, seed some default ones
    const count = await prisma.reward.count();
    if (count === 0) {
      await prisma.reward.createMany({
        data: [
          { title: 'Free Campus Coffee', description: 'Redeem for one free coffee at the campus cafe.', cost: 50, imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400' },
          { title: '₹100 Off Sustainable Brands', description: 'Get a discount on partner sustainable brands.', cost: 100, imageUrl: 'https://images.unsplash.com/photo-1605256585681-455837661b18?auto=format&fit=crop&q=80&w=400' },
          { title: 'Premium Eco Badge', description: 'Show off your dedication with a shiny profile badge.', cost: 200, imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400' },
          { title: 'Reusable Water Bottle', description: 'A high-quality stainless steel water bottle.', cost: 300, imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400' },
          { title: 'Eco-Friendly Tote Bag', description: 'Perfect for your grocery shopping without plastic.', cost: 150, imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=400' },
          { title: 'Local Transit Pass', description: 'One day free pass for local public transport.', cost: 500, imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400' }
        ]
      });
    } else if (count === 3) {
      await prisma.reward.createMany({
        data: [
          { title: 'Reusable Water Bottle', description: 'A high-quality stainless steel water bottle.', cost: 300, imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400' },
          { title: 'Eco-Friendly Tote Bag', description: 'Perfect for your grocery shopping without plastic.', cost: 150, imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=400' },
          { title: 'Local Transit Pass', description: 'One day free pass for local public transport.', cost: 500, imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400' }
        ]
      });
    }

    const rewards = await prisma.reward.findMany();
    res.json(rewards);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

import { AuthRequest } from '../middlewares/auth';

export const redeemReward = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { rewardId } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const reward = await prisma.reward.findUnique({ where: { id: rewardId } });

    if (!user || !reward) {
      res.status(404).json({ error: 'User or reward not found' });
      return;
    }

    if (user.ecoPoints < reward.cost) {
      res.status(400).json({ error: 'Not enough EcoPoints' });
      return;
    }

    // Deduct points
    await prisma.user.update({
      where: { id: userId },
      data: { ecoPoints: user.ecoPoints - reward.cost }
    });

    res.json({ message: `Successfully redeemed ${reward.title}!` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSquads = async (req: Request, res: Response) => {
  try {
    const count = await prisma.squad.count();
    if (count === 0) {
      await prisma.squad.createMany({
        data: [
          { name: 'EcoWarriors', description: 'Top sustainability advocates on campus.' },
          { name: 'Green Engineers', description: 'Engineers building a sustainable future.' },
          { name: 'Zero Waste Club', description: 'Striving for a zero waste lifestyle.' },
          { name: 'Plastic Free Heroes', description: 'Dedicated to eliminating single-use plastics.' }
        ]
      });
    } else if (count === 3) {
      await prisma.squad.create({
        data: { name: 'Plastic Free Heroes', description: 'Dedicated to eliminating single-use plastics.' }
      });
    }

    const squads = await prisma.squad.findMany({
      include: {
        _count: { select: { members: true } }
      }
    });

    res.json(squads);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const joinSquad = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { squadId } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { squadId }
    });

    res.json({ message: 'Successfully joined the squad!' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
