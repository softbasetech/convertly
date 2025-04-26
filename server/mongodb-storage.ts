import session from 'express-session';
import MongoStore from 'connect-mongo';
import { IStorage } from './storage';
import { User, Conversion, QRCode, APIKey, IUser, IConversion, IQRCode, IAPIKey } from './mongodb/models';
import { 
  getUserById, getUserByUsername, getUserByEmail, getUserByGoogleId,
  createUser as createUserAuth, updateUser as updateUserAuth, 
  resetDailyConversions as resetUserConversions,
  decrementUserConversions as decrementUserDailyConversions
} from './mongodb/auth';
import {
  createConversion as createConversionData,
  getConversionsByUserId as getConversionsByUserIdData,
  createQRCode as createQRCodeData,
  getQRCodesByUserId as getQRCodesByUserIdData,
  createAPIKey as createAPIKeyData,
  getAPIKeysByUserId as getAPIKeysByUserIdData,
  getAPIKeyByKey as getAPIKeyByKeyData,
  revokeAPIKey as revokeAPIKeyData
} from './mongodb/data';
import { nanoid } from 'nanoid';
import { Payment } from './mongodb/models';

export class MongoDBStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
    });
  }

  // User operations
  async getUser(id: number): Promise<IUser | undefined> {
    const user = await getUserById(id.toString());
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<IUser | undefined> {
    const user = await getUserByUsername(username);
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<IUser | undefined> {
    const user = await getUserByEmail(email);
    return user || undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<IUser | undefined> {
    const user = await getUserByGoogleId(googleId);
    return user || undefined;
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = await createUserAuth(userData);
    if (!user) {
      throw new Error('Failed to create user');
    }
    return user;
  }

  async updateUser(id: number, data: Partial<IUser>): Promise<IUser> {
    const user = await updateUserAuth(id.toString(), data);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async resetDailyConversions(): Promise<void> {
    await resetUserConversions();
  }

  // Conversion operations
  async createConversion(conversionData: Partial<IConversion>): Promise<IConversion> {
    const conversion = await createConversionData(conversionData);
    if (!conversion) {
      throw new Error('Failed to create conversion');
    }
    return conversion;
  }

  async getConversionsByUserId(userId: number): Promise<IConversion[]> {
    return await getConversionsByUserIdData(userId.toString());
  }

  async decrementUserConversions(userId: number): Promise<boolean> {
    return await decrementUserDailyConversions(userId.toString());
  }

  // QR Code operations
  async createQRCode(qrCodeData: Partial<IQRCode>): Promise<IQRCode> {
    const qrCode = await createQRCodeData(qrCodeData);
    if (!qrCode) {
      throw new Error('Failed to create QR code');
    }
    return qrCode;
  }

  async getQRCodesByUserId(userId: number): Promise<IQRCode[]> {
    return await getQRCodesByUserIdData(userId.toString());
  }

  // API Key operations
  async createAPIKey(apiKeyData: Partial<IAPIKey>): Promise<IAPIKey> {
    const apiKey = await createAPIKeyData(apiKeyData);
    if (!apiKey) {
      throw new Error('Failed to create API key');
    }
    return apiKey;
  }

  async getAPIKeysByUserId(userId: number): Promise<IAPIKey[]> {
    return await getAPIKeysByUserIdData(userId.toString());
  }

  async getAPIKeyByKey(key: string): Promise<IAPIKey | undefined> {
    const apiKey = await getAPIKeyByKeyData(key);
    return apiKey || undefined;
  }

  async revokeAPIKey(id: number): Promise<boolean> {
    return await revokeAPIKeyData(id.toString());
  }

  // Stripe operations
  async updateUserStripeInfo(userId: number, info: { stripeCustomerId?: string | null, stripeSubscriptionId?: string | null }): Promise<IUser> {
    const user = await updateUserAuth(userId.toString(), info);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUserSubscriptionStatus(userId: number, isPro: boolean): Promise<IUser> {
    const user = await updateUserAuth(userId.toString(), { isPro });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createPayment(data: Omit<IPayment, 'id' | 'createdAt'>): Promise<IPayment> {
    const payments = await Payment.find().sort({ id: -1 }).limit(1);
    const nextId = payments.length > 0 ? payments[0].id + 1 : 1;

    const payment = new Payment({
      ...data,

  async createContactForm(data: { name: string; email: string; message: string }): Promise<IContactForm> {
    const forms = await ContactForm.find().sort({ id: -1 }).limit(1);
    const nextId = forms.length > 0 ? forms[0].id + 1 : 1;

    const form = new ContactForm({
      id: nextId,
      ...data,
      createdAt: new Date()
    });

    await form.save();
    return form;
  }

      id: nextId,
      createdAt: new Date()
    });

    await payment.save();
    return payment;
  }

  async updatePaymentStatus(reference: string, status: 'success' | 'failed'): Promise<void> {
    await Payment.findOneAndUpdate(
      { providerReference: reference },
      { status }
    );
  }
}