export type Profile = {
  id: string;
  clerk_id: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
};

export type RecipeBook = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type Recipe = {
  id: string;
  recipe_book_id: string;
  title: string;
  description: string | null;
  ingredients: any[];
  instructions: any[];
  prep_time: string | null;
  cook_time: string | null;
  servings: number | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type Collaborator = {
  id: string;
  recipe_book_id: string;
  user_id: string;
  role: 'viewer' | 'editor' | 'admin';
  created_at: string;
  updated_at: string;
};