import { View, Text,TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { styles } from "@/styles/feed.styles";
import {Link} from "expo-router"
import {Image} from "expo-image"
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';


type PostProps = {
  post:{
    _id: Id<"posts">;
    imageUrl: string;
    caption?: string;
    likes: number;
    comments: number;
    _creationTime: number;
    isLike:boolean;
    isBookmarked:boolean;
    author:{
      _id:string,
      username:string,
      image:string,
    },
  }
}
export default function Post({post}:PostProps){
  const [isLiked , setIsLiked] = useState(post.isLike);
  const [likeCount , setLikeCount] = useState(post.likes);

  const toggleLike = useMutation(api.posts.toggleLike);
  const handleLike = async()=>{
    try {
      const newisLiked = await toggleLike({postId:post._id as Id<"posts">})
      setIsLiked(newisLiked.liked)
      setLikeCount((prev) => (newisLiked ? prev + 1: prev - 1))
      
    } catch (error) {
      console.log("Error toggle like:", error)
    }
  }
  return (
    <View style={styles.post}>
        <View style={styles.postHeader}>
            <Link href={"/(tabs)/notifications"}>
            <TouchableOpacity style={styles.postHeaderLeft}>
                <Image
                source={post.author.image}
                style={styles.postAvatar}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
                />
                <Text style={styles.postUsername}>{post.author.username}</Text>
                </TouchableOpacity>
            </Link>
              <TouchableOpacity>
                <Ionicons name="trash-outline" size={20} color={COLORS.white}/>
              </TouchableOpacity>
              {/* <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white}/>
              </TouchableOpacity> */}
        </View>    
        <Image
        source={post.imageUrl}
        style={styles.postImage}
        contentFit='cover'
        transition={200}
        cachePolicy="memory-disk"
        />
        <View style={styles.postActions}>
          <View style={styles.postActionsLeft}>
            <TouchableOpacity onPress={handleLike}>
              <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} 
              color={isLiked ? COLORS.primary : COLORS.white}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="chatbubble-outline" size={24} color={COLORS.white}/>
            </TouchableOpacity>
          </View>
            <TouchableOpacity>
              <Ionicons name="bookmark-outline" size={24} color={COLORS.white}/>
            </TouchableOpacity>
        </View>
        <View style={styles.postInfo}>
          <Text style={styles.likesText}>
               {likeCount > 0 ? `${likeCount.toLocaleString()} likes`: "Be the first to like"}
          </Text>
          {post.caption && (
            <View style={styles.captionContainer}>
              <Text style={styles.captionUsername}>{post.author.username}</Text>
              <Text style={styles.captionText}>{post.caption}</Text>
            </View>
          )}
          <TouchableOpacity>
            <Text style={styles.commentText}>View all 2 comments</Text>
          </TouchableOpacity>
          <Text style={styles.timeAgo}>2 hours ago</Text>
        </View>
    </View>
  )
}