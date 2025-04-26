import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { QRCode, QRCodeData } from '@shared/schema';

export function useQRCode() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);

  const { data: qrCodes, isLoading: isLoadingQRCodes } = useQuery<{
    qrCodes: QRCode[];
  }>({
    queryKey: ['/api/users/me'],
    enabled: !!user,
  });

  const generateQRCodeMutation = useMutation({
    mutationFn: async (data: QRCodeData) => {
      const response = await apiRequest('POST', '/api/qr-code', data);
      return await response.json();
    },
    onSuccess: (data) => {
      setGeneratedQR(data.qrSvg);
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      toast({
        title: "QR Code generated",
        description: "Your QR code has been generated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "QR Code generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const downloadQRCode = (format: 'svg' | 'png') => {
    if (!generatedQR) return;

    const a = document.createElement('a');
    const fileName = `qrcode-${Date.now()}.${format}`;

    if (format === 'svg') {
      const blob = new Blob([generatedQR], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'png') {
      // Convert SVG to PNG
      const svgBlob = new Blob([generatedQR], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const pngUrl = URL.createObjectURL(blob);
          a.href = pngUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(pngUrl);
        }, 'image/png');
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  return {
    qrCodes: qrCodes?.qrCodes || [],
    isLoadingQRCodes,
    generateQRCode: generateQRCodeMutation.mutate,
    isPending: generateQRCodeMutation.isPending,
    generatedQR,
    downloadQRCode,
    isProUser: user?.isPro || false,
  };
}
