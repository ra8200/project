import { auth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function Home() {
  const { userId } = auth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <UtensilsCrossed className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-6">
            Family Traditions Recipe Book
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Preserve and share your cherished family recipes in a beautiful digital collection.
          </p>
          <div className="flex gap-4 justify-center">
            {userId ? (
              <Button asChild>
                <Link href="/recipes">View Recipes</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="default">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}