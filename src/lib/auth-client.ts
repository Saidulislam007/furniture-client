import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  // No baseURL is needed here. Better Auth will use this app's own
  // /api/auth endpoint, so localhost and the deployed domain stay in sync.
  plugins: [inferAdditionalFields<typeof auth>()],
});
