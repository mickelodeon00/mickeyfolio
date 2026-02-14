import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// Clerk webhook endpoint
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await request.json();

    // When user signs up
    if (event.type === "user.created") {
      const { id, email_addresses, first_name, last_name } = event.data;

      await ctx.runMutation(internal.users.create, {
        clerkId: id,
        email: email_addresses[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim(),
      });
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;