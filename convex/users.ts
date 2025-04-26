import { mutation, MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    clerkId: v.string(),
  },

  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

      // await ctx.auth.getUserIdentity()

    if (existingUser) return null;

    await ctx.db.insert("users", {
      username: args.username.trim(),
      fullname: args.fullname.trim(),
      email: args.email.trim(),
      bio: args.bio?.trim(),
      image: args.image,
      clerkId: args.clerkId,
      followers: 0,
      following: 0,
      posts: 0,
    });

    return true;
  },
});

export async function getAuthenticatedUser  (ctx:QueryCtx | MutationCtx){
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) throw new Error("User not found");

    return currentUser
  
}
