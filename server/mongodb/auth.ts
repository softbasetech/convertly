import { User, IUser } from './models';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

// Compare a password with a stored hashed password
export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split('.');
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// User operations
export async function getUserById(id: string): Promise<IUser | null> {
  try {
    return await User.findById(id);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

export async function getUserByUsername(username: string): Promise<IUser | null> {
  try {
    return await User.findOne({ username });
  } catch (error) {
    console.error('Error getting user by username:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function getUserByGoogleId(googleId: string): Promise<IUser | null> {
  try {
    return await User.findOne({ googleId });
  } catch (error) {
    console.error('Error getting user by Google ID:', error);
    return null;
  }
}

export async function createUser(userData: Partial<IUser>): Promise<IUser | null> {
  try {
    const newUser = new User(userData);
    return await newUser.save();
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
  try {
    return await User.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

export async function resetDailyConversions(): Promise<void> {
  try {
    await User.updateMany(
      {},
      { dailyConversionsLeft: 5, updatedAt: new Date() }
    );
  } catch (error) {
    console.error('Error resetting daily conversions:', error);
  }
}

export async function decrementUserConversions(userId: string): Promise<boolean> {
  try {
    const user = await User.findById(userId);
    if (!user) return false;
    
    if (user.isPro || user.dailyConversionsLeft > 0) {
      if (!user.isPro) {
        user.dailyConversionsLeft -= 1;
        await user.save();
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error decrementing user conversions:', error);
    return false;
  }
}