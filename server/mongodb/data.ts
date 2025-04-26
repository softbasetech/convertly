import { Conversion, QRCode, APIKey, IConversion, IQRCode, IAPIKey } from './models';
import { connectToDatabase } from './connect';
import { nanoid } from 'nanoid';

// Connect to database
connectToDatabase();

// Conversion operations
export async function createConversion(conversionData: Partial<IConversion>): Promise<IConversion | null> {
  try {
    // Generate a unique ID
    const lastConversion = await Conversion.findOne().sort({ id: -1 });
    const newId = lastConversion ? lastConversion.id + 1 : 1;
    
    // Create the conversion
    const conversion = new Conversion({
      id: newId,
      userId: conversionData.userId,
      sourceFormat: conversionData.sourceFormat,
      targetFormat: conversionData.targetFormat,
      originalFilename: conversionData.originalFilename,
      convertedFilename: conversionData.convertedFilename,
      status: conversionData.status || 'completed',
      createdAt: new Date()
    });
    
    await conversion.save();
    return conversion;
  } catch (error) {
    console.error('Error creating conversion:', error);
    return null;
  }
}

export async function getConversionsByUserId(userId: string): Promise<IConversion[]> {
  try {
    return await Conversion.find({ userId: parseInt(userId) }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error getting conversions by user ID:', error);
    return [];
  }
}

// QR Code operations
export async function createQRCode(qrCodeData: Partial<IQRCode>): Promise<IQRCode | null> {
  try {
    // Generate a unique ID
    const lastQRCode = await QRCode.findOne().sort({ id: -1 });
    const newId = lastQRCode ? lastQRCode.id + 1 : 1;
    
    // Create the QR code
    const qrCode = new QRCode({
      id: newId,
      userId: qrCodeData.userId,
      content: qrCodeData.content,
      type: qrCodeData.type || 'url',
      backgroundColor: qrCodeData.backgroundColor || '#FFFFFF',
      foregroundColor: qrCodeData.foregroundColor || '#000000',
      createdAt: new Date()
    });
    
    await qrCode.save();
    return qrCode;
  } catch (error) {
    console.error('Error creating QR code:', error);
    return null;
  }
}

export async function getQRCodesByUserId(userId: string): Promise<IQRCode[]> {
  try {
    return await QRCode.find({ userId: parseInt(userId) }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error getting QR codes by user ID:', error);
    return [];
  }
}

// API Key operations
export async function createAPIKey(apiKeyData: Partial<IAPIKey>): Promise<IAPIKey | null> {
  try {
    // Generate a unique ID
    const lastAPIKey = await APIKey.findOne().sort({ id: -1 });
    const newId = lastAPIKey ? lastAPIKey.id + 1 : 1;
    
    // Generate a unique key if not provided
    const key = apiKeyData.key || `sk_${nanoid(32)}`;
    
    // Create the API key
    const apiKey = new APIKey({
      id: newId,
      userId: apiKeyData.userId,
      key: key,
      name: apiKeyData.name,
      lastUsed: null,
      createdAt: new Date()
    });
    
    await apiKey.save();
    return apiKey;
  } catch (error) {
    console.error('Error creating API key:', error);
    return null;
  }
}

export async function getAPIKeysByUserId(userId: string): Promise<IAPIKey[]> {
  try {
    return await APIKey.find({ userId: parseInt(userId) }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error getting API keys by user ID:', error);
    return [];
  }
}

export async function getAPIKeyByKey(key: string): Promise<IAPIKey | null> {
  try {
    return await APIKey.findOne({ key });
  } catch (error) {
    console.error('Error getting API key by key:', error);
    return null;
  }
}

export async function revokeAPIKey(id: string): Promise<boolean> {
  try {
    const result = await APIKey.deleteOne({ id: parseInt(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error revoking API key:', error);
    return false;
  }
}

export async function updateAPIKeyLastUsed(id: string): Promise<boolean> {
  try {
    const result = await APIKey.updateOne(
      { id: parseInt(id) },
      { $set: { lastUsed: new Date() } }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating API key last used:', error);
    return false;
  }
}