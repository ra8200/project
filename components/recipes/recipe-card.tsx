import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Recipe } from "@/lib/supabase/types";

interface RecipeCardProps {
  recipe: Recipe;
  bookId: string;
}

export function RecipeCard({ recipe, bookId }: RecipeCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <Link href={`/recipes/${bookId}/${recipe.id}`}>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="line-clamp-1">{recipe.title}</CardTitle>
            {recipe.is_public && (
              <Badge variant="secondary">Public</Badge>
            )}
          </div>
          {recipe.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {recipe.description}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              {recipe.prep_time && (
                <span>Prep: {recipe.prep_time}</span>
              )}
              {recipe.cook_time && (
                <>
                  <span className="mx-2">•</span>
                  <span>Cook: {recipe.cook_time}</span>
                </>
              )}
            </div>
            {recipe.servings && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                <span>Serves {recipe.servings}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}