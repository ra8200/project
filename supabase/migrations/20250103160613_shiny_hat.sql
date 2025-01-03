/*
  # Initial Schema Setup for Family Recipes

  1. New Tables
    - `profiles`
      - Links to Clerk user data
      - Stores additional user information
    
    - `recipe_books`
      - Stores recipe book information
      - Supports private/public visibility
    
    - `recipes`
      - Stores individual recipes
      - Links to recipe books
      - Supports private/public visibility
    
    - `collaborators`
      - Manages recipe book access
      - Supports different role types
  
  2. Security
    - Enable RLS on all tables
    - Add policies for data access based on user roles
    - Secure collaboration data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY,
  clerk_id text UNIQUE NOT NULL,
  display_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipe_books table
CREATE TABLE IF NOT EXISTS recipe_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_book_id uuid NOT NULL REFERENCES recipe_books(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb,
  instructions jsonb NOT NULL DEFAULT '[]'::jsonb,
  prep_time interval,
  cook_time interval,
  servings integer,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create collaborators table
CREATE TABLE IF NOT EXISTS collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_book_id uuid NOT NULL REFERENCES recipe_books(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('viewer', 'editor', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(recipe_book_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = clerk_id);

-- Recipe Books policies
CREATE POLICY "Users can read public recipe books"
  ON recipe_books FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can read their own recipe books"
  ON recipe_books FOR SELECT
  USING (owner_id IN (
    SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
  ));

CREATE POLICY "Users can read recipe books they collaborate on"
  ON recipe_books FOR SELECT
  USING (id IN (
    SELECT recipe_book_id FROM collaborators
    WHERE user_id IN (
      SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
    )
  ));

CREATE POLICY "Users can create recipe books"
  ON recipe_books FOR INSERT
  WITH CHECK (owner_id IN (
    SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
  ));

CREATE POLICY "Users can update their own recipe books"
  ON recipe_books FOR UPDATE
  USING (owner_id IN (
    SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
  ));

CREATE POLICY "Admin collaborators can update recipe books"
  ON recipe_books FOR UPDATE
  USING (id IN (
    SELECT recipe_book_id FROM collaborators
    WHERE user_id IN (
      SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
    )
    AND role = 'admin'
  ));

-- Recipes policies
CREATE POLICY "Users can read public recipes"
  ON recipes FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can read recipes from their books"
  ON recipes FOR SELECT
  USING (recipe_book_id IN (
    SELECT id FROM recipe_books
    WHERE owner_id IN (
      SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
    )
  ));

CREATE POLICY "Users can read recipes they collaborate on"
  ON recipes FOR SELECT
  USING (recipe_book_id IN (
    SELECT recipe_book_id FROM collaborators
    WHERE user_id IN (
      SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
    )
  ));

CREATE POLICY "Users can create recipes in their books"
  ON recipes FOR INSERT
  WITH CHECK (recipe_book_id IN (
    SELECT id FROM recipe_books
    WHERE owner_id IN (
      SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
    )
  ));

CREATE POLICY "Editor collaborators can create recipes"
  ON recipes FOR INSERT
  WITH CHECK (recipe_book_id IN (
    SELECT recipe_book_id FROM collaborators
    WHERE user_id IN (
      SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
    )
    AND role IN ('editor', 'admin')
  ));

-- Collaborators policies
CREATE POLICY "Users can read collaborators for their books"
  ON collaborators FOR SELECT
  USING (recipe_book_id IN (
    SELECT id FROM recipe_books
    WHERE owner_id IN (
      SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
    )
  ));

CREATE POLICY "Users can manage collaborators for their books"
  ON collaborators FOR ALL
  USING (recipe_book_id IN (
    SELECT id FROM recipe_books
    WHERE owner_id IN (
      SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
    )
  ));

-- Create indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS idx_recipes_recipe_book_id ON recipes(recipe_book_id);
CREATE INDEX IF NOT EXISTS idx_recipe_books_owner_id ON recipe_books(owner_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_recipe_book_id ON collaborators(recipe_book_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON profiles(clerk_id);