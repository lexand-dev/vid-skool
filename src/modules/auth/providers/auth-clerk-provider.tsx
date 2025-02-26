import { ClerkProvider } from "@clerk/nextjs";

interface PropsAuthProvider {
	children: React.ReactNode;
}

export const AuthClerkProvider = ({ children }: PropsAuthProvider) => {
	return <ClerkProvider afterSignOutUrl="/">{children}</ClerkProvider>;
};
