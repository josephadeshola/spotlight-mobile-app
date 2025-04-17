import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import {styles} from "@/styles/auth.styles"
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Link href={"/notifications"}>Visit Notifications Screen</Link>
      {/* <TouchableOpacity onPress={()=>alert("You press")}>
        <Text>Press Me</Text>
      </TouchableOpacity> */}
      {/* <Pressable onPress={()=>alert("You press")}>
        <Text>press me pressible</Text>
      </Pressable> */}
      {/* <Image source={require("../assets/images/icon.png")} style={{height:100, width:100}}/> */}
    </View>
  );
}

