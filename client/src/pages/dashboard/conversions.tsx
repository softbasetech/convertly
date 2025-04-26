import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Conversion } from "@shared/schema";
import { formatDate } from "@/lib/file-utils";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Image, FilePlus, ArrowRightLeft, Search, FileUp, Filter } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function ConversionsPage() {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const { data, isLoading, error } = useQuery<{
    conversions: Conversion[];
  }>({
    queryKey: ["/api/users/me"],
    enabled: !!user,
  });
  
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const conversions = data?.conversions || [];
  
  // Filter conversions
  const filteredConversions = conversions.filter(conversion => {
    const matchesSearch = searchTerm === "" || 
      conversion.originalFilename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversion.convertedFilename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${conversion.sourceFormat} to ${conversion.targetFormat}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" ||
      (filterType === "pdf" && (conversion.sourceFormat === "pdf" || conversion.targetFormat === "pdf")) ||
      (filterType === "image" && ["png", "jpg", "jpeg", "webp"].includes(conversion.sourceFormat) || 
                               ["png", "jpg", "jpeg", "webp"].includes(conversion.targetFormat)) ||
      (filterType === "doc" && (conversion.sourceFormat === "docx" || conversion.targetFormat === "docx"));
    
    return matchesSearch && matchesType;
  });
  
  // Group conversions by date
  const groupedConversions: Record<string, Conversion[]> = {};
  
  filteredConversions.forEach(conversion => {
    const date = new Date(conversion.createdAt).toISOString().split('T')[0];
    if (!groupedConversions[date]) {
      groupedConversions[date] = [];
    }
    groupedConversions[date].push(conversion);
  });
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedConversions).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  // Helper function to get file icon
  const getFileIcon = (format: string) => {
    if (format === "pdf") {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (format === "docx") {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (["png", "jpg", "jpeg", "webp"].includes(format)) {
      return <Image className="h-5 w-5 text-green-500" />;
    } else {
      return <FilePlus className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatTypeLabel = (sourceFormat: string, targetFormat: string) => {
    return `${sourceFormat.toUpperCase()} → ${targetFormat.toUpperCase()}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex pt-16">
        <DashboardSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-6 lg:pl-72">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Conversion History</h1>
                <p className="text-muted-foreground">
                  View and manage your previous file conversions
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link href="/convert">
                  <Button>
                    <FileUp className="mr-2 h-4 w-4" />
                    New Conversion
                  </Button>
                </Link>
              </div>
            </div>
            
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversions..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground hidden sm:inline">Filter:</span>
                    <Select
                      value={filterType}
                      onValueChange={setFilterType}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Conversions</SelectItem>
                        <SelectItem value="pdf">PDF Conversions</SelectItem>
                        <SelectItem value="image">Image Conversions</SelectItem>
                        <SelectItem value="doc">Document Conversions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {filteredConversions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <ArrowRightLeft className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No conversions found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {conversions.length === 0 
                    ? "You haven't made any conversions yet. Start by converting a file."
                    : "No conversions match your current filters."}
                </p>
                {conversions.length === 0 && (
                  <Link href="/convert">
                    <Button className="mt-4">
                      Start Converting
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {sortedDates.map((date) => (
                  <div key={date}>
                    <h2 className="mb-4 text-lg font-semibold">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h2>
                    <Card>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File</TableHead>
                            <TableHead>Conversion Type</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {groupedConversions[date].map((conversion) => (
                            <TableRow key={conversion.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <div className="bg-gray-50 p-2 rounded-md">
                                    {getFileIcon(conversion.sourceFormat)}
                                  </div>
                                  <div className="font-medium">{conversion.originalFilename}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <span className="flex items-center space-x-1">
                                    {getFileIcon(conversion.sourceFormat)}
                                    <span>{conversion.sourceFormat.toUpperCase()}</span>
                                  </span>
                                  <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                                  <span className="flex items-center space-x-1">
                                    {getFileIcon(conversion.targetFormat)}
                                    <span>{conversion.targetFormat.toUpperCase()}</span>
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(conversion.createdAt).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">
                                  {conversion.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                ))}
              </div>
            )}
            
            {filteredConversions.length > 0 && user && !user.isPro && (
              <div className="mt-8 p-4 bg-primary-50 border border-primary-100 rounded-lg">
                <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Need more conversions?</h3>
                    <p className="text-sm text-gray-600">
                      Upgrade to Pro for unlimited conversions, larger file sizes, and API access.
                    </p>
                  </div>
                  <Link href="/dashboard/subscription">
                    <Button>Upgrade to Pro</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
