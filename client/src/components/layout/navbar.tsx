import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  RefreshCw,
  QrCode,
  Settings,
  CreditCard,
  Edit3,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U'; // Default fallback for undefined name
    
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Edit3 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">ConvertHub</span>
            </Link>
            <nav className="ml-10 hidden md:flex items-center space-x-6">
              <Link href="/" className={`text-gray-900 hover:text-primary font-medium ${location === "/" ? "text-primary" : ""}`}>
                Home
              </Link>
              <Link href="/convert" className={`text-gray-900 hover:text-primary font-medium ${location.startsWith("/convert") ? "text-primary" : ""}`}>
                Convert
              </Link>
              <Link href="/qr-code" className={`text-gray-900 hover:text-primary font-medium ${location === "/qr-code" ? "text-primary" : ""}`}>
                QR Code
              </Link>
              <Link href="/pricing" className={`text-gray-900 hover:text-primary font-medium ${location === "/pricing" ? "text-primary" : ""}`}>
                Pricing
              </Link>
              <Link href="/docs" className={`text-gray-900 hover:text-primary font-medium ${location === "/docs" ? "text-primary" : ""}`}>
                Docs
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {user.isPro && (
                  <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-light text-secondary">
                    PRO
                  </span>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-white">
                          {getInitials(user.displayName || user.username)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center cursor-pointer w-full">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/conversions" className="flex items-center cursor-pointer w-full">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        <span>Conversions</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.isPro && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/api-keys" className="flex items-center cursor-pointer w-full">
                          <QrCode className="mr-2 h-4 w-4" />
                          <span>API Keys</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="flex items-center cursor-pointer w-full">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/subscription" className="flex items-center cursor-pointer w-full">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Subscription</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/auth">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link href="/auth">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
            
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
              Home
            </Link>
            <Link href="/convert" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
              Convert
            </Link>
            <Link href="/qr-code" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
              QR Code
            </Link>
            <Link href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
              Pricing
            </Link>
            <Link href="/docs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
              Docs
            </Link>
            
            {!user && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3 gap-4">
                  <Link href="/auth" className="w-full">
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link href="/auth" className="w-full">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              </div>
            )}
            
            {user && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3">
                  <div className="flex-shrink-0">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-white">
                        {getInitials(user.displayName || user.username)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.displayName || user.username}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
                    Profile
                  </Link>
                  <Link href="/dashboard/subscription" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
                    Subscription
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
