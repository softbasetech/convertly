import { User, IUser } from './models';
import { connectToDatabase } from './connect';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

// Connect to database
connectToDatabase();

// Promisify scrypt
const scryptAsync = promisify(scrypt);

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

// Password comparison
export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split('.');
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Get user by ID
export async function getUserById(id: string): Promise<IUser | null> {
  try {
    return await User.findOne({ id: parseInt(id) });
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

// Get user by username
export async function getUserByUsername(username: string): Promise<IUser | null> {
  try {
    return await User.findOne({ username });
  } catch (error) {
    console.error('Error getting user by username:', error);
    return null;
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<IUser | null> {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

// Get user by Google ID
export async function getUserByGoogleId(googleId: string): Promise<IUser | null> {
  try {
    return await User.findOne({ googleId });
  } catch (error) {
    console.error('Error getting user by Google ID:', error);
    return null;
  }
}

// Create a new user
export async function createUser(userData: Partial<IUser>): Promise<IUser | null> {
  try {
    // Generate a unique ID
    const lastUser = await User.findOne().sort({ id: -1 });
    const newId = lastUser ? lastUser.id + 1 : 1;
    
    // Create the user with default values
    const user = new User({
      id: newId,
      ...userData,
      role: 'user',
      dailyConversionsRemaining: 5,
      lastConversionReset: new Date(),
      isPro: false,
      createdAt: new Date()
    });
    
    await user.save();
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Update an existing user
export async function updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
  try {
    const user = await User.findOneAndUpdate(
      { id: parseInt(id) },
      { $set: data },
      { new: true }
    );
    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

// Reset daily conversions for all users
export async function resetDailyConversions(): Promise<void> {
  try {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    await User.updateMany(
      { lastConversionReset: { $lt: yesterday } },
      { 
        $set: { 
          dailyConversionsRemaining: 5,
          lastConversionReset: now 
        }
      }
    );
  } catch (error) {
    console.error('Error resetting daily conversions:', error);
  }
}

// Decrement user's daily conversions
export async function decrementUserConversions(userId: string): Promise<boolean> {
  try {
    const user = await User.findOne({ id: parseInt(userId) });
    
    if (!user) {
      return false;
    }
    
    if (user.isPro) {
      return true; // Pro users have unlimited conversions
    }
    
    if (user.dailyConversionsRemaining <= 0) {
      return false; // No conversions remaining
    }
    
    await User.updateOne(
      { id: parseInt(userId) },
      { $inc: { dailyConversionsRemaining: -1 } }
    );
    
    return true;
  } catch (error) {
    console.error('Error decrementing user conversions:', error);
    return false;
  }
}