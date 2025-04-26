import { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { FileUp, X, FileText, Image, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileType, formatFileSize, validateFileType } from '@/lib/file-utils';

interface DropzoneProps {
  onFileDrop: (file: File) => void;
  acceptedTypes: FileType[];
  maxSize?: number; // in MB
  className?: string;
}

export function Dropzone({ onFileDrop, acceptedTypes, maxSize = 100, className = '' }: DropzoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getFileTypeLabel = (types: FileType[]): string => {
    return types.map(type => type.toUpperCase()).join(', ');
  };

  const getAcceptedFileMapping = (types: FileType[]): Record<string, string[]> => {
    const mapping: Record<string, string[]> = {};
    
    types.forEach(type => {
      switch(type) {
        case 'pdf':
          mapping['application/pdf'] = ['.pdf'];
          break;
        case 'docx':
          mapping['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] = ['.docx'];
          break;
        case 'jpg':
        case 'jpeg':
          mapping['image/jpeg'] = ['.jpg', '.jpeg'];
          break;
        case 'png':
          mapping['image/png'] = ['.png'];
          break;
        case 'webp':
          mapping['image/webp'] = ['.webp'];
          break;
      }
    });
    
    return mapping;
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    
    if (type === 'application/pdf') {
      return <FileText className="w-12 h-12 text-primary" />;
    } else if (type.startsWith('image/')) {
      return <Image className="w-12 h-12 text-primary" />;
    } else {
      return <File className="w-12 h-12 text-primary" />;
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      const errorMessages = rejectedFiles[0].errors.map(err => err.message);
      setError(errorMessages.join(', '));
      return;
    }
    
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      onFileDrop(file);
    }
  }, [onFileDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptedFileMapping(acceptedTypes),
    maxSize: maxSize * 1024 * 1024,
    multiple: false,
  });

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className={className}>
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            isDragActive 
              ? 'border-primary bg-primary-50' 
              : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          <input {...getInputProps()} />
          <FileUp className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-medium text-gray-700">
            {isDragActive ? (
              "Drop the file here..."
            ) : (
              <>
                Drag & drop a file here, or <span className="text-primary">browse</span>
              </>
            )}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Accepted types: {getFileTypeLabel(acceptedTypes)} (Max: {maxSize}MB)
          </p>
          
          {error && (
            <div className="mt-2 text-sm text-red-500">
              {error}
            </div>
          )}
        </div>
      ) : (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getFileIcon(selectedFile)}
              <div>
                <p className="font-medium truncate max-w-[240px] sm:max-w-sm">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
