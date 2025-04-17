import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayOut from "@/components/InitialLayOut";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";

const publishabelKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishabelKey) {
  throw new Error("Missing publishabel key");
}
export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
          <InitialLayOut />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}
// import { Stack } from "expo-router";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { ClerkProvider,ClerkLoaded } from '@clerk/clerk-expo'

// const publishabelKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
// if(!publishabelKey){
//   throw new Error(
//     "Missing publishabel key"
//   )
// }
// export default function RootLayout() {
//   return (
//     <ClerkProvider>
//       <ClerkLoaded>

//     <SafeAreaProvider>
//     <SafeAreaView style={{flex:1, backgroundColor:"#000"}}>
//       <Stack screenOptions={{headerShown:false}}/>
//     </SafeAreaView>
//   </SafeAreaProvider>
//       </ClerkLoaded>
//     </ClerkProvider>
// );
// }
