import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, firstName, lastName, phone, businessName, gstNumber, licenseNumber, address } = req.body;

    if (!email || !password || !role) {
      res.status(400).json({ error: 'Email, password, and role are required' });
      return;
    }

    if (role !== 'HOUSEHOLD' && role !== 'BUSINESS') {
      res.status(400).json({ error: 'Role must be HOUSEHOLD or BUSINESS' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists with this email' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        firstName,
        lastName,
        phone,
        ...(role === 'BUSINESS' && {
          businessProfile: {
            create: {
              businessName: businessName || '',
              gstNumber,
              licenseNumber,
              address,
            }
          }
        })
      },
      include: {
        businessProfile: true
      }
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        businessProfile: user.businessProfile
      }
    });
  } catch (error: any) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Internal server error during signup' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { businessProfile: true }
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ecoPoints: user.ecoPoints,
        businessProfile: user.businessProfile
      }
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

import { AuthRequest } from '../middlewares/auth';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { businessProfile: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      ecoPoints: user.ecoPoints,
      businessProfile: user.businessProfile
    });
  } catch (error: any) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ error: 'Internal server error getting profile' });
  }
};
