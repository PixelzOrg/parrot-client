import { View, Text, Image } from "react-native";

export default function Profile() {
  return (
    <View
      style={{
        backgroundColor: "#121212",
        flex: 1,
      }}
    >
      <Image
        style={{
          alignSelf: "center",
          height: 400,
          width: 400,
        }}
        source={require("../assets/knowledge.png")}
      />
      <Text
        style={{
          color: "white",
          textAlign: "center",
          fontSize: 32,
        }}
      >
        Coming Soon...
      </Text>
    </View>
  );
}
