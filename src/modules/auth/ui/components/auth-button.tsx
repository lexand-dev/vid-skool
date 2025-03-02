"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ClapperboardIcon, UserCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const AuthButton = () => {
  // TODO: Add different auth states
  return (
    <>
      <SignedIn>
        {/* Add menu item for User profile */}
				<UserButton>
					<UserButton.MenuItems>
						<UserButton.Link
							href="/studio"
							label="Studio"
							labelIcon={<ClapperboardIcon className="size-4" />}
						/>
						<UserButton.Action label="manageAccount" />
					</UserButton.MenuItems>
				</UserButton>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none"
          >
            <UserCircleIcon />
            <span>Sign in</span>
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};
