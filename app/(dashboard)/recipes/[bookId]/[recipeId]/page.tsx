import { currentUser } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Clock, Users, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecipePageProps {
  params: {
    bookId: string;
    recipeId: string;
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const user = await currentUser();
  
  // Get user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", user?.id)
    .single();

  // Get recipe with book details
  const { data: recipe } = await supabase
    .from("recipes")
    .select(`
      *,
      recipe_books (
        id,
        name,
        owner_id
      )
    `)
    .eq("id", params.recipeId)
    .single();

  if (!recipe) {
    notFound();
  }

  const isOwner = recipe.recipe_books.owner_id === profile?.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{recipe.title}</h1>
            {recipe.description && (
              <p className="text-muted-foreground mt-2">{recipe.description}</p>
            )}
          </div>
          {isOwner && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 mb-8">
          {recipe.prep_time && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">Prep: {recipe.prep_time}</span>
            </div>
          )}
          {recipe.cook_time && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">Cook: {recipe.cook_time}</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">Serves {recipe.servings}</span>
            </div>
          )}
          {recipe.is_public && (
            <Badge variant="secondary">Public</Badge>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient: string, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="text-sm">{ingredient}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction: string, index: number) => (
                <li key={index} className="flex">
                  <span className="font-medium mr-4">{index + 1}.</span>
                  <span className="text-sm">{instruction}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}