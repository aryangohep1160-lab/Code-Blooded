import { Request, Response } from 'express';

const MOCK_PARTNERS = [
  {
    id: '1',
    name: 'TechFix Electronics',
    type: 'REPAIR',
    category: 'Electronics',
    address: '124 Main Street, Downtown',
    distance: '1.2 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=400',
    description: 'Expert repairs for laptops, smartphones, and household electronics.',
    phone: '+1 (555) 123-4567',
    hours: 'Mon-Sat: 9AM - 6PM',
    website: 'www.techfixelectronics.com'
  },
  {
    id: '2',
    name: 'GreenEarth E-Waste',
    type: 'RECYCLE',
    category: 'E-Waste',
    address: 'Industrial Park, Block C',
    distance: '3.5 km',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400',
    description: 'Certified e-waste drop-off and responsible recycling center.',
    phone: '+1 (555) 987-6543',
    hours: 'Mon-Fri: 8AM - 4PM',
    website: 'www.greenearth-ewaste.org'
  },
  {
    id: '3',
    name: 'Goodwill Donation Center',
    type: 'DONATION',
    category: 'Clothing & Furniture',
    address: '89 Community Blvd',
    distance: '0.8 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=400',
    description: 'Accepting gently used clothes, books, and furniture for charity.',
    phone: '+1 (555) 333-2222',
    hours: 'Daily: 10AM - 7PM',
    website: 'www.goodwillcenter.org'
  },
  {
    id: '4',
    name: 'The Woodshop Wizards',
    type: 'REPAIR',
    category: 'Furniture',
    address: '42 Artisan Alley',
    distance: '2.1 km',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&q=80&w=400',
    description: 'Specializing in wooden furniture restoration and upcycling.',
    phone: '+1 (555) 888-9999',
    hours: 'Tue-Sun: 10AM - 5PM',
    website: 'www.woodshopwizards.com'
  }
];

export const getPartners = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    let results = MOCK_PARTNERS;

    if (type && type !== 'ALL') {
      results = MOCK_PARTNERS.filter(p => p.type === type);
    }

    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
