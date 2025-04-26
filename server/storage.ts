import { 
  users, type User, type InsertUser,
  conversions, type Conversion, type InsertConversion,
  qrCodes, type QRCode, type InsertQRCode,
  apiKeys, type APIKey, type InsertAPIKey
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { randomBytes } from "crypto";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // Session store
  sessionStore: session.SessionStore;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  resetDailyConversions(): Promise<void>;
  
  // Conversion operations
  createConversion(conversion: InsertConversion): Promise<Conversion>;
  getConversionsByUserId(userId: number): Promise<Conversion[]>;
  decrementUserConversions(userId: number): Promise<boolean>;
  
  // QR Code operations
  createQRCode(qrCode: InsertQRCode): Promise<QRCode>;
  getQRCodesByUserId(userId: number): Promise<QRCode[]>;
  
  // API Key operations
  createAPIKey(apiKey: InsertAPIKey): Promise<APIKey>;
  getAPIKeysByUserId(userId: number): Promise<APIKey[]>;
  getAPIKeyByKey(key: string): Promise<APIKey | undefined>;
  revokeAPIKey(id: number): Promise<boolean>;
  
  // Stripe operations
  updateUserStripeInfo(userId: number, info: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User>;
  updateUserSubscriptionStatus(userId: number, isPro: boolean): Promise<User>;
}

export class MemStorage implements IStorage {
  // Storage maps
  private users: Map<number, User>;
  private conversions: Map<number, Conversion>;
  private qrCodes: Map<number, QRCode>;
  private apiKeys: Map<number, APIKey>;
  
  // ID counters
  private userIdCounter: number;
  private conversionIdCounter: number;
  private qrCodeIdCounter: number;
  private apiKeyIdCounter: number;
  
  // Session store
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.conversions = new Map();
    this.qrCodes = new Map();
    this.apiKeys = new Map();
    
    this.userIdCounter = 1;
    this.conversionIdCounter = 1;
    this.qrCodeIdCounter = 1;
    this.apiKeyIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Prune expired sessions every 24h
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.googleId === googleId
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const now = new Date();
    const id = this.userIdCounter++;
    const user: User = {
      id,
      ...userData,
      role: "user",
      dailyConversionsRemaining: 5,
      lastConversionReset: now,
      isPro: false,
      createdAt: now,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      googleId: userData.googleId || null,
      displayName: userData.displayName || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async resetDailyConversions(): Promise<void> {
    const now = new Date();
    for (const [id, user] of this.users.entries()) {
      const lastReset = user.lastConversionReset;
      const today = new Date().setHours(0, 0, 0, 0);
      const lastResetDay = new Date(lastReset).setHours(0, 0, 0, 0);
      
      if (lastResetDay < today) {
        await this.updateUser(id, {
          dailyConversionsRemaining: user.isPro ? Infinity : 5,
          lastConversionReset: now
        });
      }
    }
  }

  // Conversion operations
  async createConversion(conversionData: InsertConversion): Promise<Conversion> {
    const now = new Date();
    const id = this.conversionIdCounter++;
    const conversion: Conversion = {
      id,
      ...conversionData,
      createdAt: now
    };
    this.conversions.set(id, conversion);
    return conversion;
  }

  async getConversionsByUserId(userId: number): Promise<Conversion[]> {
    return Array.from(this.conversions.values())
      .filter((conversion) => conversion.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async decrementUserConversions(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user) {
      return false;
    }
    
    if (user.isPro) {
      return true; // Pro users have unlimited conversions
    }
    
    if (user.dailyConversionsRemaining <= 0) {
      return false; // No conversions remaining
    }
    
    await this.updateUser(userId, {
      dailyConversionsRemaining: user.dailyConversionsRemaining - 1
    });
    
    return true;
  }

  // QR Code operations
  async createQRCode(qrCodeData: InsertQRCode): Promise<QRCode> {
    const now = new Date();
    const id = this.qrCodeIdCounter++;
    const qrCode: QRCode = {
      id,
      ...qrCodeData,
      createdAt: now
    };
    this.qrCodes.set(id, qrCode);
    return qrCode;
  }

  async getQRCodesByUserId(userId: number): Promise<QRCode[]> {
    return Array.from(this.qrCodes.values())
      .filter((qrCode) => qrCode.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // API Key operations
  async createAPIKey(apiKeyData: InsertAPIKey): Promise<APIKey> {
    const now = new Date();
    const id = this.apiKeyIdCounter++;
    const apiKey: APIKey = {
      id,
      ...apiKeyData,
      lastUsed: null,
      createdAt: now
    };
    this.apiKeys.set(id, apiKey);
    return apiKey;
  }

  async getAPIKeysByUserId(userId: number): Promise<APIKey[]> {
    return Array.from(this.apiKeys.values())
      .filter((apiKey) => apiKey.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAPIKeyByKey(key: string): Promise<APIKey | undefined> {
    return Array.from(this.apiKeys.values()).find(
      (apiKey) => apiKey.key === key
    );
  }

  async revokeAPIKey(id: number): Promise<boolean> {
    return this.apiKeys.delete(id);
  }

  // Stripe operations
  async updateUserStripeInfo(userId: number, info: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User> {
    return this.updateUser(userId, {
      stripeCustomerId: info.stripeCustomerId,
      stripeSubscriptionId: info.stripeSubscriptionId
    });
  }

  async updateUserSubscriptionStatus(userId: number, isPro: boolean): Promise<User> {
    return this.updateUser(userId, { isPro });
  }
}

// Import MongoDB storage
import { MongoDBStorage } from './mongodb-storage';

// Initialize storage based on environment
let storageImplementation: IStorage;

if (process.env.MONGODB_URI) {
  console.log('Using MongoDB storage');
  storageImplementation = new MongoDBStorage();
} else {
  console.log('Using in-memory storage');
  storageImplementation = new MemStorage();
}

export const storage = storageImplementation;
