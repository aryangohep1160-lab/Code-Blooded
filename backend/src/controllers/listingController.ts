import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createListing = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { title, description, price, condition, type } = req.body;
    
    // If a file was uploaded, construct its URL, else use the provided URL (if any)
    let imageUrl = req.body.imageUrl || null;
    if (req.file) {
      imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: price ? parseFloat(price) : null,
        condition,
        type,
        imageUrl,
        userId
      }
    });

    res.status(201).json(listing);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getListings = async (req: Request, res: Response) => {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            businessProfile: { select: { businessName: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(listings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
