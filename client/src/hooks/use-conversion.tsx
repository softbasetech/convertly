import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Conversion } from '@shared/schema';
import { FileType } from '@/lib/file-utils';

export function useConversion() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [conversionInProgress, setConversionInProgress] = useState(false);

  const { data: conversions, isLoading: isLoadingConversions } = useQuery<{
    conversions: Conversion[];
  }>({
    queryKey: ['/api/users/me'],
    enabled: !!user,
  });

  const convertFileMutation = useMutation({
    mutationFn: async ({ file, sourceFormat, targetFormat }: {
      file: File;
      sourceFormat: FileType;
      targetFormat: FileType;
    }) => {
      setConversionInProgress(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sourceFormat', sourceFormat);
      formData.append('targetFormat', targetFormat);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Conversion failed');
      }

      // For file downloads, we need to handle the response differently
      const blob = await response.blob();
      const filename = response.headers.get('content-disposition')?.split('filename=')[1]?.trim() || 
                      `converted-${Date.now()}.${targetFormat}`;
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename.replace(/"/g, '');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    },
    onSuccess: () => {
      setConversionInProgress(false);
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      toast({
        title: "Conversion successful",
        description: "Your file has been converted successfully.",
      });
    },
    onError: (error: Error) => {
      setConversionInProgress(false);
      toast({
        title: "Conversion failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    conversions: conversions?.conversions || [],
    isLoadingConversions,
    convertFile: convertFileMutation.mutate,
    isPending: convertFileMutation.isPending,
    conversionInProgress,
    remainingConversions: user?.dailyConversionsRemaining || 0,
    isProUser: user?.isPro || false,
  };
}
