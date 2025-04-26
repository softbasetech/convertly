import { useState } from 'react';
import { Dropzone } from '@/components/dropzone';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ConversionOption, FileType, validateFileType } from '@/lib/file-utils';
import { useToast } from '@/hooks/use-toast';
import { useConversion } from '@/hooks/use-conversion';
import { useAuth } from '@/hooks/use-auth';
import { AlertCircle, Info, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'wouter';

interface FileConverterProps {
  title: string;
  description: string;
  conversionOptions: ConversionOption[];
  allowedSourceTypes: FileType[];
}

export function FileConverter({ 
  title, 
  description, 
  conversionOptions, 
  allowedSourceTypes
}: FileConverterProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState<ConversionOption | null>(null);
  const { toast } = useToast();
  const { convertFile, isPending, remainingConversions, isProUser } = useConversion();
  const { user } = useAuth();
  
  const handleFileDrop = (file: File) => {
    setSelectedFile(file);
    
    // Auto-select a conversion option based on the file type
    if (file) {
      const fileExt = file.name.split('.').pop()?.toLowerCase() as FileType;
      const option = conversionOptions.find(opt => opt.sourceFormat === fileExt);
      
      if (option) {
        setSelectedOption(option);
      } else {
        setSelectedOption(null);
      }
    }
  };
  
  const handleOptionChange = (value: string) => {
    const option = conversionOptions.find(opt => `${opt.sourceFormat}-to-${opt.targetFormat}` === value);
    if (option) {
      setSelectedOption(option);
    }
  };
  
  const handleConvert = () => {
    if (!selectedFile || !selectedOption) {
      toast({
        title: "Missing information",
        description: "Please select a file and conversion option.",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateFileType(selectedFile, [selectedOption.sourceFormat])) {
      toast({
        title: "Invalid file type",
        description: `Selected file does not match the source format ${selectedOption.sourceFormat.toUpperCase()}`,
        variant: "destructive",
      });
      return;
    }
    
    convertFile({
      file: selectedFile,
      sourceFormat: selectedOption.sourceFormat,
      targetFormat: selectedOption.targetFormat
    });
  };
  
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isProUser && remainingConversions === 0 ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>You've reached your daily conversion limit.</span>
              <Link href="/pricing">
                <Button variant="outline" size="sm">Upgrade to Pro</Button>
              </Link>
            </AlertDescription>
          </Alert>
        ) : (
          !isProUser && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You have {remainingConversions} conversion{remainingConversions !== 1 ? 's' : ''} remaining today.
              </AlertDescription>
            </Alert>
          )
        )}
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Upload File
          </h3>
          <Dropzone
            onFileDrop={handleFileDrop}
            acceptedTypes={allowedSourceTypes}
            maxSize={isProUser ? 100 : 10}
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Conversion Type
          </h3>
          <Select 
            onValueChange={handleOptionChange} 
            value={selectedOption ? `${selectedOption.sourceFormat}-to-${selectedOption.targetFormat}` : ''}
            disabled={!selectedFile}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select conversion type" />
            </SelectTrigger>
            <SelectContent>
              {conversionOptions.map((option) => (
                <SelectItem 
                  key={`${option.sourceFormat}-to-${option.targetFormat}`} 
                  value={`${option.sourceFormat}-to-${option.targetFormat}`}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleConvert} 
          disabled={!selectedFile || !selectedOption || isPending || (!isProUser && remainingConversions === 0)}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            "Convert Now"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
