import { currentUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { RecipeList } from "@/components/recipes/recipe-list";

export default async function RecipesPage() {
  const user = await currentUser();
  
  // Get user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", user?.id)
    .single();

  // Get user's recipe books and their recipes
  const { data: recipeBooks } = await supabase
    .from("recipe_books")
    .select(`
      id,
      name,
      description,
      recipes (*)
    `)
    .eq("owner_id", profile?.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Recipes</h1>
          <p className="text-muted-foreground mt-1">
            Manage your recipe collection
          </p>
        </div>
        <Button asChild>
          <Link href="/recipes/new">
            <Plus className="mr-2 h-4 w-4" />
            New Recipe
          </Link>
        </Button>
      </div>

      <div className="space-y-10">
        {recipeBooks?.map((book) => (
          <section key={book.id}>
            <h2 className="text-2xl font-semibold mb-4">{book.name}</h2>
            {book.recipes && book.recipes.length > 0 ? (
              <RecipeList recipes={book.recipes} bookId={book.id} />
            ) : (
              <p className="text-muted-foreground">No recipes yet.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}