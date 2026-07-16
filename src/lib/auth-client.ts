import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth"; // নিশ্চিত করুন আপনার auth ফাইলটি সঠিকভাবে ইম্পোর্ট হচ্ছে

export const authClient = createAuthClient({
    /** The base URL of the server */
    baseURL: process.env.BETTER_AUTH_URL,
    
    plugins: [
        inferAdditionalFields<typeof auth>()
    ]
});