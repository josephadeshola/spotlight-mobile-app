import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./users";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return await ctx.storage.generateUploadUrl();
});
export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    storageId: v.id("_storage"),
  },

  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    // to get image url
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) throw new Error("Image not found");

    // post creation

    const postId = await ctx.db.insert("posts", {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      caption: args.caption || "",
      likes: 0,
      comments: 0,
    });

    // increment user post count

    await ctx.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });

    return postId;
  },
});

export const getFeedPosts = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);
    // get all post

    const posts = await ctx.db.query("posts").order("desc").collect();

    if (posts.length === 0) return [];
    const postWithInfo = await Promise.all(
      posts.map(async (post) => {
        const postAuthor = (await ctx.db.get(post.userId))!;

        const like = await ctx.db
          .query("likes")
          .withIndex("by_user_and_post", (q) =>
            q.eq("userId", currentUser._id).eq("postId", post._id)
          )
          .first();
  
        const bookmark = await ctx.db
          .query("bookmarks")
          .withIndex("by_user_and_post", (q) =>
            q.eq("userId", currentUser._id).eq("postId", post._id)
          )
          .first();

          return {
            ...post,
            author:{
              _id:postAuthor?._id,
              username: postAuthor?.username,
              image:postAuthor?.image,
            },
            isLike:!!like,
             isBookmarked:!!bookmark
          }
      })
    );
    return postWithInfo;
  },
});

export const toggleLike = mutation({
  args:{postId: v.id("posts")},
  handler:async (ctx,args)=>{
    const currentUser = await getAuthenticatedUser(ctx);
    // if the user already like the post or not
    const existing = await ctx.db
    .query("likes")
    .withIndex("by_user_and_post", (q)=>
    q.eq("userId", currentUser._id).eq("postId", args.postId))
    .first();

    const post = await ctx.db.get(args.postId);
    if(!post) throw new Error("Post not found")
    if(existing){
      await ctx.db.delete(existing._id);
      await ctx.db.patch(args.postId, {likes:post.likes -1})
      return { liked: false };
    }
    else{
      await ctx.db.insert("likes", {
        userId: currentUser._id,
        postId: args.postId,
      });
      await ctx.db.patch(args.postId, {likes:post.likes +1})
      if(currentUser._id !== post.userId){
        await ctx.db.insert("notifications", {
          receiverId: post.userId,
          senderId: currentUser._id,
          type:"like",
          postId: args.postId
        })
      }
      return { liked: true };
    }
  }
})