import { RecipeCard } from "@/components/recipes/recipe-card";
import type { Recipe } from "@/lib/supabase/types";

interface RecipeListProps {
  recipes: Recipe[];
  bookId: string;
}

export function RecipeList({ recipes, bookId }: RecipeListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} bookId={bookId} />
      ))}
    </div>
  );
}