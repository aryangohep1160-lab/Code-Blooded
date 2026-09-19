import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Squads
  const sq1 = await prisma.squad.upsert({
    where: { name: 'EcoWarriors' },
    update: {},
    create: { name: 'EcoWarriors', description: 'Top sustainability advocates on campus and central zones.' }
  });

  const sq2 = await prisma.squad.upsert({
    where: { name: 'Green Engineers' },
    update: {},
    create: { name: 'Green Engineers', description: 'Engineers building circular tech and modular hardware repairs.' }
  });

  const sq3 = await prisma.squad.upsert({
    where: { name: 'Zero Waste Club' },
    update: {},
    create: { name: 'Zero Waste Club', description: 'Committed to zero landfill output through peer swaps and reuse.' }
  });

  await prisma.squad.upsert({
    where: { name: 'Plastic Free Heroes' },
    update: {},
    create: { name: 'Plastic Free Heroes', description: 'Dedicated to eliminating single-use packaging and plastics.' }
  });

  // 2. Create Users
  const u1 = await prisma.user.upsert({
    where: { email: 'aarav@recircle.eco' },
    update: {},
    create: {
      email: 'aarav@recircle.eco',
      passwordHash,
      role: 'HOUSEHOLD',
      firstName: 'Aarav',
      lastName: 'Patel',
      phone: '+91 98765 43210',
      ecoPoints: 340,
      squadId: sq1.id
    }
  });

  const u2 = await prisma.user.upsert({
    where: { email: 'diya@recircle.eco' },
    update: {},
    create: {
      email: 'diya@recircle.eco',
      passwordHash,
      role: 'HOUSEHOLD',
      firstName: 'Diya',
      lastName: 'Shah',
      phone: '+91 98234 56789',
      ecoPoints: 180,
      squadId: sq3.id
    }
  });

  const u3 = await prisma.user.upsert({
    where: { email: 'rohan@recircle.eco' },
    update: {},
    create: {
      email: 'rohan@recircle.eco',
      passwordHash,
      role: 'BUSINESS',
      firstName: 'Rohan',
      lastName: 'Mehta',
      phone: '+91 99001 12233',
      ecoPoints: 850,
      squadId: sq2.id,
      businessProfile: {
        create: {
          businessName: 'Gujarat Circular Solutions',
          gstNumber: '24AABCU9603R1ZM',
          licenseNumber: 'GUJ-REC-2026',
          address: 'Ellisbridge Industrial Belt, Ahmedabad',
          isVerified: true
        }
      }
    }
  });

  // 3. Create Rewards
  const rewardsCount = await prisma.reward.count();
  if (rewardsCount === 0) {
    await prisma.reward.createMany({
      data: [
        { title: 'Free Campus Coffee', description: 'Redeem for one artisan organic coffee at the campus cafe.', cost: 50, imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400' },
        { title: '₹100 Off Sustainable Brands', description: 'Get a discount voucher on verified partner zero-waste brands.', cost: 100, imageUrl: 'https://images.unsplash.com/photo-1605256585681-455837661b18?auto=format&fit=crop&q=80&w=400' },
        { title: 'Eco-Friendly Tote Bag', description: 'Sturdy organic cotton bag perfect for grocery shopping without plastic.', cost: 150, imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=400' },
        { title: 'Premium Eco Badge', description: 'Showcase your dedication with a gleaming verified profile badge.', cost: 200, imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400' },
        { title: 'Reusable Water Bottle', description: 'Insulated food-grade stainless steel bottle to eliminate PET plastic.', cost: 300, imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400' },
        { title: 'Local Transit Pass', description: 'One-day unlimited pass for eco-friendly public transit & BRTS.', cost: 500, imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400' }
      ]
    });
  }

  // 4. Create Listings
  const listingsCount = await prisma.listing.count();
  if (listingsCount === 0) {
    await prisma.listing.createMany({
      data: [
        {
          userId: u1.id,
          title: 'Ergonomic Mesh Study Chair',
          description: 'High back breathable mesh office chair with adjustable lumbar support and hydraulic lift. Diverted from discard!',
          condition: 'Used',
          type: 'SELL',
          price: 1499.0,
          imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=600'
        },
        {
          userId: u2.id,
          title: 'Computer Science & AI Textbooks Bundle',
          description: 'Semester 3 to 6 reference books for Algorithms, Python, and Machine Learning. Clean annotations inside.',
          condition: 'Like New',
          type: 'SWAP',
          price: 0.0,
          imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80'
        },
        {
          userId: u1.id,
          title: 'Philips Electric Kettle 1.5L',
          description: 'Stainless steel fast-boiling kettle. Fully tested and descaled. Perfect for hostel or office pantry.',
          condition: 'Used',
          type: 'SELL',
          price: 450.0,
          imageUrl: 'https://images.unsplash.com/photo-1594213114663-d94db9b17125?w=600&q=80'
        },
        {
          userId: u2.id,
          title: 'Mechanical Keyboard (Cherry MX Blue)',
          description: 'Tactile mechanical keyboard with braided USB cable. Free donation to engineering students who need it!',
          condition: 'Used',
          type: 'DONATE',
          price: 0.0,
          imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80'
        },
        {
          userId: u3.id,
          title: 'Electronics & Gadgets Repair Hero Service',
          description: 'Free diagnostics and circuit repair service for faulty laptops, chargers, and headphones.',
          condition: 'Used',
          type: 'REPAIR',
          price: 100.0,
          imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80'
        }
      ]
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
