"use client"

import { UserButton } from "@clerk/nextjs";

export function UserNav() {
  return (
    <UserButton 
      appearance={{
        elements: {
          userButtonBox: "h-8 w-8",
          userButtonTrigger: "h-8 w-8",
          userButtonAvatarBox: "h-8 w-8"
        }
      }}
    />
  );
}