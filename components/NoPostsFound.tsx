import { View, Text } from 'react-native'
import React from 'react'
import { COLORS } from "@/constants/theme";

export default function NoPostsFound() {
  return (
    <View style={{flex:1,backgroundColor:COLORS.background, justifyContent:"center", alignItems:"center" }}>
      <Text style={{fontSize:20, color:COLORS.primary}}>No Posts yet</Text>
    </View>
  )
}