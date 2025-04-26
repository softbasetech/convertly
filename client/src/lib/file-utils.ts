import { Conversion } from "@shared/schema";

export type FileType = 'pdf' | 'docx' | 'jpg' | 'jpeg' | 'png' | 'webp';

export interface ConversionOption {
  sourceFormat: FileType;
  targetFormat: FileType;
  label: string;
  icon?: string;
}

export const getMimeType = (fileType: FileType): string => {
  switch (fileType) {
    case 'pdf':
      return 'application/pdf';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
};

export const getFileTypeFromMime = (mimeType: string): FileType | null => {
  switch (mimeType) {
    case 'application/pdf':
      return 'pdf';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'docx';
    case 'image/jpeg':
      return 'jpeg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return null;
  }
};

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateFileType = (file: File, allowedTypes: FileType[]): boolean => {
  const fileType = getFileTypeFromMime(file.type);
  return fileType !== null && allowedTypes.includes(fileType);
};

export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  return file.size <= maxSizeInMB * 1024 * 1024;
};

export const getPDFConversionOptions = (): ConversionOption[] => [
  { sourceFormat: 'pdf', targetFormat: 'docx', label: 'PDF to DOCX' },
  { sourceFormat: 'docx', targetFormat: 'pdf', label: 'DOCX to PDF' },
  { sourceFormat: 'pdf', targetFormat: 'png', label: 'PDF to PNG' },
  { sourceFormat: 'pdf', targetFormat: 'jpg', label: 'PDF to JPG' },
];

export const getImageConversionOptions = (): ConversionOption[] => [
  { sourceFormat: 'png', targetFormat: 'jpg', label: 'PNG to JPG' },
  { sourceFormat: 'jpg', targetFormat: 'png', label: 'JPG to PNG' },
  { sourceFormat: 'png', targetFormat: 'webp', label: 'PNG to WebP' },
  { sourceFormat: 'jpg', targetFormat: 'webp', label: 'JPG to WebP' },
  { sourceFormat: 'webp', targetFormat: 'png', label: 'WebP to PNG' },
  { sourceFormat: 'webp', targetFormat: 'jpg', label: 'WebP to JPG' },
  { sourceFormat: 'jpg', targetFormat: 'pdf', label: 'JPG to PDF' },
  { sourceFormat: 'png', targetFormat: 'pdf', label: 'PNG to PDF' },
];

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
