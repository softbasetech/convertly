import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { APIKey } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/file-utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Redirect } from "wouter";
import { Loader2, PlusCircle, Key, Copy, Trash2, CheckCircle, LockKeyhole, KeyRound, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function APIKeysPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newKeyName, setNewKeyName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newKeyDetails, setNewKeyDetails] = useState<APIKey | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Redirect non-Pro users
  if (user && !user.isPro) {
    return <Redirect to="/pricing" />;
  }
  
  const { data, isLoading, error } = useQuery<APIKey[]>({
    queryKey: ['/api/api-keys'],
    enabled: !!user && user.isPro,
  });
  
  const createKeyMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("POST", "/api/api-keys", { name });
      return await res.json();
    },
    onSuccess: (data: APIKey) => {
      queryClient.invalidateQueries({ queryKey: ['/api/api-keys'] });
      setNewKeyDetails(data);
      setNewKeyName("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create API key",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const deleteKeyMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/api-keys/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/api-keys'] });
      toast({
        title: "API key revoked",
        description: "The API key has been successfully revoked.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to revoke API key",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your API key.",
        variant: "destructive",
      });
      return;
    }
    
    createKeyMutation.mutate(newKeyName);
  };
  
  const handleDeleteKey = (id: number) => {
    deleteKeyMutation.mutate(id);
  };
  
  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex pt-16">
        <DashboardSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-6 lg:pl-72">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
                <p className="text-muted-foreground">
                  Manage your API keys for programmatic access to ConvertHub
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New API Key</DialogTitle>
                      <DialogDescription>
                        Give your API key a name to help you identify it later.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Key Name</Label>
                        <Input
                          id="name"
                          placeholder="e.g. Production Server"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreateKey} 
                        disabled={createKeyMutation.isPending}
                      >
                        {createKeyMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Key"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* Show new key dialog */}
                {newKeyDetails && (
                  <Dialog 
                    open={!!newKeyDetails} 
                    onOpenChange={(open) => !open && setNewKeyDetails(null)}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>API Key Created</DialogTitle>
                        <DialogDescription>
                          Your new API key has been created. Copy it now as it won't be shown again.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="api-key">API Key</Label>
                          <div className="flex">
                            <Input
                              id="api-key"
                              value={newKeyDetails.key}
                              readOnly
                              className="pr-10 font-mono text-sm"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-16"
                              onClick={() => copyToClipboard(newKeyDetails.key)}
                            >
                              {copiedKey === newKeyDetails.key ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            This key will only be shown once. Make sure to copy it now.
                          </AlertDescription>
                        </Alert>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={() => {
                            copyToClipboard(newKeyDetails.key);
                            setNewKeyDetails(null);
                          }}
                        >
                          Copy and Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  Learn how to use the ConvertHub API to automate file conversions and QR code generation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  The API provides endpoints for file conversion and QR code generation. Use the keys below to authenticate your requests.
                </p>
                <Button variant="outline" asChild>
                  <a href="/docs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                    <KeyRound className="mr-2 h-4 w-4" />
                    View API Documentation
                  </a>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Your API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for programmatic access to ConvertHub
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data && data.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Used</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((apiKey) => (
                        <TableRow key={apiKey.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <LockKeyhole className="mr-2 h-4 w-4 text-muted-foreground" />
                              {apiKey.name}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(new Date(apiKey.createdAt))}</TableCell>
                          <TableCell>
                            {apiKey.lastUsed ? formatDate(new Date(apiKey.lastUsed)) : "Never used"}
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action will revoke the API key "{apiKey.name}". This cannot be undone.
                                    Applications using this key will no longer be able to access the API.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteKey(apiKey.id)} 
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Revoke Key
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Key className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No API keys yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                      Create your first API key to start integrating ConvertHub with your applications.
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                      Create API Key
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start sm:items-center flex-col sm:flex-row gap-4">
                <div className="p-2 rounded-full bg-yellow-50">
                  <Info className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Security Recommendations</h3>
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Never share your API keys in public repositories or client-side code</li>
                    <li>Use environment variables to store your API keys</li>
                    <li>Rotate your API keys periodically for enhanced security</li>
                    <li>Revoke any API keys that you suspect may have been compromised</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
