import { tokenCache } from "@/cache";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const publishabelKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishabelKey) {
    throw new Error("Missing publishabel key");
}

const convex = new ConvexReactClient(
    process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false
}
);

export default function ClerkAndConvexProvider({children}:{children:React.ReactNode}) {
    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishabelKey}>
            <ConvexProviderWithClerk
                client={convex}
                useAuth={useAuth}
            >
                <ClerkLoaded>
                    {children}
                </ClerkLoaded>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
