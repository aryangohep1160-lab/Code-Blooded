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
    const { search, type } = req.query;
    
    let whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { title: { contains: String(search) } },
        { description: { contains: String(search) } }
      ];
    }
    if (type && type !== 'ALL') {
      whereClause.type = String(type);
    }

    const listings = await prisma.listing.findMany({
      where: whereClause,
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

export const getListingById = async (req: Request, res: Response) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: String(req.params.id) },
      include: {
        user: {
          select: {
            firstName: true,
            businessProfile: { select: { businessName: true, address: true } }
          }
        }
      }
    });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const claimItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const id = String(req.params.id);

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    // Delete listing as it's claimed
    await prisma.listing.delete({ where: { id } });

    // Award EcoPoints to buyer (10) and seller (20)
    await prisma.user.update({
      where: { id: userId },
      data: { ecoPoints: { increment: 10 } }
    });
    
    if (userId !== listing.userId) {
      await prisma.user.update({
        where: { id: listing.userId },
        data: { ecoPoints: { increment: 20 } }
      });
    }

    res.json({ message: 'Item claimed successfully! You earned 10 EcoPoints.', earned: 10 });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserListings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const listings = await prisma.listing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(listings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  try {
    const listingId = String(req.params.id);
    const userId = (req as any).user.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    if (listing.userId !== userId) {
      return res.status(403).json({ error: 'You can only delete your own listings' });
    }

    await prisma.listing.delete({ where: { id: listingId } });
    res.json({ message: 'Listing deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
