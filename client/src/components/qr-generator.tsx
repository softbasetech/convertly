import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQRCode } from '@/hooks/use-qr-code';
import { Loader2, Download } from 'lucide-react';
import { QRCodeData } from '@shared/schema';
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

export function QRGenerator() {
  const [qrData, setQrData] = useState<QRCodeData>({
    content: '',
    type: 'url',
    name: '',
    options: {
      color: '#000000',
      backgroundColor: '#ffffff',
      size: 300,
      margin: 4
    }
  });
  const { generateQRCode, isPending, generatedQR, downloadQRCode } = useQRCode();
  
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrData({
      ...qrData,
      content: e.target.value
    });
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrData({
      ...qrData,
      name: e.target.value
    });
  };
  
  const handleTypeChange = (value: string) => {
    setQrData({
      ...qrData,
      type: value as 'url' | 'text' | 'email'
    });
  };
  
  const handleColorChange = (color: string) => {
    setQrData({
      ...qrData,
      options: {
        ...qrData.options,
        color
      }
    });
  };
  
  const handleBgColorChange = (color: string) => {
    setQrData({
      ...qrData,
      options: {
        ...qrData.options,
        backgroundColor: color
      }
    });
  };
  
  const handleSizeChange = (value: number[]) => {
    setQrData({
      ...qrData,
      options: {
        ...qrData.options,
        size: value[0]
      }
    });
  };
  
  const handleMarginChange = (value: number[]) => {
    setQrData({
      ...qrData,
      options: {
        ...qrData.options,
        margin: value[0]
      }
    });
  };
  
  const handleGenerate = () => {
    if (!qrData.content) return;
    generateQRCode(qrData);
  };
  
  const handleDownload = (format: 'svg' | 'png') => {
    downloadQRCode(format);
  };
  
  const getPlaceholder = () => {
    switch(qrData.type) {
      case 'url':
        return 'https://example.com';
      case 'text':
        return 'Enter any text here';
      case 'email':
        return 'example@email.com';
      default:
        return '';
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>
            Create QR codes for URLs, text, or email addresses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content">Content Type</Label>
            <RadioGroup 
              defaultValue="url" 
              value={qrData.type} 
              onValueChange={handleTypeChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="url" id="url" />
                <Label htmlFor="url">URL</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text">Text</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">Email</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Input
              id="content"
              placeholder={getPlaceholder()}
              value={qrData.content}
              onChange={handleContentChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input
              id="name"
              placeholder="My QR Code"
              value={qrData.name}
              onChange={handleNameChange}
            />
          </div>
          
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>QR Code Color</Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-10 h-10 p-0">
                        <div 
                          className="w-full h-full rounded" 
                          style={{ backgroundColor: qrData.options?.color }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3">
                      <HexColorPicker 
                        color={qrData.options?.color} 
                        onChange={handleColorChange} 
                      />
                    </PopoverContent>
                  </Popover>
                  <Input 
                    value={qrData.options?.color} 
                    onChange={(e) => handleColorChange(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-10 h-10 p-0">
                        <div 
                          className="w-full h-full rounded" 
                          style={{ backgroundColor: qrData.options?.backgroundColor }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3">
                      <HexColorPicker 
                        color={qrData.options?.backgroundColor} 
                        onChange={handleBgColorChange} 
                      />
                    </PopoverContent>
                  </Popover>
                  <Input 
                    value={qrData.options?.backgroundColor} 
                    onChange={(e) => handleBgColorChange(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Size: {qrData.options?.size}px</Label>
                </div>
                <Slider 
                  defaultValue={[qrData.options?.size || 300]} 
                  max={500} 
                  min={100} 
                  step={10}
                  onValueChange={handleSizeChange}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Margin: {qrData.options?.margin}</Label>
                </div>
                <Slider 
                  defaultValue={[qrData.options?.margin || 4]} 
                  max={10} 
                  min={0} 
                  step={1}
                  onValueChange={handleMarginChange}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleGenerate} 
            disabled={!qrData.content || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate QR Code"
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            Your generated QR code will appear here
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-6">
          {isPending ? (
            <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : generatedQR ? (
            <div className="flex justify-center">
              <div 
                dangerouslySetInnerHTML={{ __html: generatedQR }} 
                className="max-w-full"
              />
            </div>
          ) : (
            <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-400 text-center">QR code preview will<br />appear here</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => handleDownload('svg')}
            disabled={!generatedQR}
          >
            <Download className="mr-2 h-4 w-4" />
            Download SVG
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDownload('png')}
            disabled={!generatedQR}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PNG
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
