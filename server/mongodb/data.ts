import { Conversion, QRCode, APIKey, IConversion, IQRCode, IAPIKey } from './models';
import { nanoid } from 'nanoid';

// Conversion operations
export async function createConversion(conversionData: Partial<IConversion>): Promise<IConversion | null> {
  try {
    const newConversion = new Conversion(conversionData);
    return await newConversion.save();
  } catch (error) {
    console.error('Error creating conversion:', error);
    return null;
  }
}

export async function getConversionsByUserId(userId: string): Promise<IConversion[]> {
  try {
    return await Conversion.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  } catch (error) {
    console.error('Error getting conversions by user ID:', error);
    return [];
  }
}

// QR Code operations
export async function createQRCode(qrCodeData: Partial<IQRCode>): Promise<IQRCode | null> {
  try {
    const newQRCode = new QRCode(qrCodeData);
    return await newQRCode.save();
  } catch (error) {
    console.error('Error creating QR code:', error);
    return null;
  }
}

export async function getQRCodesByUserId(userId: string): Promise<IQRCode[]> {
  try {
    return await QRCode.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  } catch (error) {
    console.error('Error getting QR codes by user ID:', error);
    return [];
  }
}

// API Key operations
export async function createAPIKey(apiKeyData: Partial<IAPIKey>): Promise<IAPIKey | null> {
  try {
    const key = nanoid(32);
    const newAPIKey = new APIKey({
      ...apiKeyData,
      key,
    });
    return await newAPIKey.save();
  } catch (error) {
    console.error('Error creating API key:', error);
    return null;
  }
}

export async function getAPIKeysByUserId(userId: string): Promise<IAPIKey[]> {
  try {
    return await APIKey.find({ userId, isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  } catch (error) {
    console.error('Error getting API keys by user ID:', error);
    return [];
  }
}

export async function getAPIKeyByKey(key: string): Promise<IAPIKey | null> {
  try {
    return await APIKey.findOne({ key, isActive: true });
  } catch (error) {
    console.error('Error getting API key by key:', error);
    return null;
  }
}

export async function revokeAPIKey(id: string): Promise<boolean> {
  try {
    const result = await APIKey.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() }
    );
    return !!result;
  } catch (error) {
    console.error('Error revoking API key:', error);
    return false;
  }
}

export async function updateAPIKeyLastUsed(id: string): Promise<boolean> {
  try {
    const result = await APIKey.findByIdAndUpdate(
      id,
      { lastUsed: new Date(), updatedAt: new Date() }
    );
    return !!result;
  } catch (error) {
    console.error('Error updating API key last used:', error);
    return false;
  }
}