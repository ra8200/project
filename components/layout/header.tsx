"use client";

import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <UtensilsCrossed className="h-6 w-6" />
          <span className="font-semibold">Family Recipes</span>
        </Link>
        
        <nav className="ml-8 flex space-x-6">
          <Link 
            href="/recipes"
            className={cn(
              "text-sm transition-colors hover:text-primary",
              isActive("/recipes") ? "text-primary" : "text-muted-foreground"
            )}
          >
            My Recipes
          </Link>
          <Link 
            href="/shared"
            className={cn(
              "text-sm transition-colors hover:text-primary",
              isActive("/shared") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Shared with Me
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}