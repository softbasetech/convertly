import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/file-utils";
import { Conversion, QRCode } from "@shared/schema";
import { Link } from "wouter";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import {
  FileText,
  BarChart2,
  CheckCircle,
  FileUp,
  QrCode,
  RefreshCw,
  ArrowUpRight,
  Upload,
  Key,
  CreditCard
} from "lucide-react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  
  const { data, isLoading, error } = useQuery<{
    conversions: Conversion[];
    qrCodes: QRCode[];
    conversionCount: number;
    qrCodeCount: number;
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
  
  // Calculate daily limit progress
  const dailyLimit = user?.isPro ? Infinity : 5;
  const remainingConversions = user ? user.dailyConversionsRemaining : 0;
  const usedConversions = dailyLimit === Infinity ? 0 : dailyLimit - remainingConversions;
  const progressPercentage = dailyLimit === Infinity ? 0 : (usedConversions / dailyLimit) * 100;
  
  // Generate data for charts
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  // Format conversions by date
  const conversionsByDate: Record<string, number> = {};
  last7Days.forEach(date => {
    conversionsByDate[date] = 0;
  });
  
  data?.conversions.forEach(conversion => {
    const date = new Date(conversion.createdAt).toISOString().split('T')[0];
    if (last7Days.includes(date)) {
      conversionsByDate[date] = (conversionsByDate[date] || 0) + 1;
    }
  });
  
  const conversionChartData = Object.entries(conversionsByDate).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    conversions: count
  }));
  
  // Format conversions by type
  const conversionTypes: Record<string, number> = {};
  data?.conversions.forEach(conversion => {
    const type = `${conversion.sourceFormat} to ${conversion.targetFormat}`;
    conversionTypes[type] = (conversionTypes[type] || 0) + 1;
  });
  
  const conversionTypeData = Object.entries(conversionTypes)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex pt-16">
        <DashboardSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-6 lg:pl-72">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.displayName || user?.username}!
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-2">
                <Link href="/convert">
                  <Button>
                    <FileUp className="mr-2 h-4 w-4" />
                    New Conversion
                  </Button>
                </Link>
                <Link href="/qr-code">
                  <Button variant="outline">
                    <QrCode className="mr-2 h-4 w-4" />
                    New QR Code
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.conversionCount || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Files converted since joining
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">QR Codes</CardTitle>
                  <QrCode className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.qrCodeCount || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    QR codes generated
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                  <CheckCircle className={`h-4 w-4 ${user?.isPro ? 'text-success' : 'text-muted-foreground'}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user?.isPro ? 'Pro' : 'Free'}</div>
                  <p className="text-xs text-muted-foreground">
                    {user?.isPro ? 'Unlimited access' : 'Limited access'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Conversions</CardTitle>
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-1">
                    <div className="text-2xl font-bold">
                      {user?.isPro ? 'Unlimited' : `${remainingConversions}/${dailyLimit}`}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {user?.isPro ? '∞' : `${Math.round(progressPercentage)}%`}
                    </span>
                  </div>
                  {!user?.isPro && (
                    <Progress value={progressPercentage} className="h-2" />
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {user?.isPro ? 'No daily limits' : 'Resets daily at midnight'}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
              <Card className="md:col-span-2 lg:col-span-5">
                <CardHeader>
                  <CardTitle>Activity Overview</CardTitle>
                  <CardDescription>Your conversion activity over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {conversionChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={conversionChartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="conversions" 
                            stroke="#1677ff" 
                            fill="#e6f4ff" 
                            name="Conversions"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No conversion data available yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Top Conversions</CardTitle>
                  <CardDescription>Most used conversion types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {conversionTypeData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={conversionTypeData}
                          margin={{ top: 10, right: 30, left: 50, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" allowDecimals={false} />
                          <YAxis type="category" dataKey="type" />
                          <Tooltip />
                          <Bar dataKey="count" fill="#1677ff" name="Conversions" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No conversion data available yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {/* Recent Conversions */}
              <Card className="xl:col-span-2">
                <CardHeader className="flex flex-row items-center">
                  <div className="flex-1">
                    <CardTitle>Recent Conversions</CardTitle>
                    <CardDescription>Your latest file conversions</CardDescription>
                  </div>
                  <Link href="/dashboard/conversions">
                    <Button variant="outline" size="sm" className="ml-auto">
                      View all
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {data?.conversions && data.conversions.length > 0 ? (
                    <div className="space-y-4">
                      {data.conversions.slice(0, 5).map((conversion) => (
                        <div key={conversion.id} className="flex items-center space-x-4">
                          <div className="p-2 bg-primary-50 rounded-md">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {conversion.originalFilename} 
                              <span className="text-muted-foreground font-normal">
                                {' → '}{conversion.targetFormat.toUpperCase()}
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {conversion.sourceFormat.toUpperCase()} to {conversion.targetFormat.toUpperCase()}
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(new Date(conversion.createdAt))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No conversions found</p>
                      <Link href="/convert">
                        <Button className="mt-3" variant="outline" size="sm">
                          Convert your first file
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get started with these tools</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Link href="/convert/pdf" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      <span>PDF Conversions</span>
                    </Button>
                  </Link>
                  
                  <Link href="/convert/image" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <FileUp className="mr-2 h-5 w-5 text-primary" />
                      <span>Image Conversions</span>
                    </Button>
                  </Link>
                  
                  <Link href="/qr-code" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <QrCode className="mr-2 h-5 w-5 text-primary" />
                      <span>Generate QR Code</span>
                    </Button>
                  </Link>
                  
                  {user?.isPro ? (
                    <Link href="/dashboard/api-keys" className="w-full">
                      <Button variant="outline" className="w-full justify-start">
                        <Key className="mr-2 h-5 w-5 text-primary" />
                        <span>Manage API Keys</span>
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/dashboard/subscription" className="w-full">
                      <Button variant="outline" className="w-full justify-start">
                        <CreditCard className="mr-2 h-5 w-5 text-primary" />
                        <span>Upgrade to Pro</span>
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
