import { View, SafeAreaView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Loading() {
  const { navigate } = useNavigation();

  useEffect(() => {
    togglePages();
  });

  const togglePages = async () => {
    try {
      // Read the value from AsyncStorage
      //await AsyncStorage.setItem("visibility", JSON.stringify(true));
      const value = JSON.parse(await AsyncStorage.getItem("visibility"));

      // If value is null (first time), set to true; otherwise, parse the value
      //console.log(value);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (value === null || value === true) {
        navigate("Onboarding", {});
      } else {
        navigate("TabGroup", {});
      }
    } catch (error) {
      console.error("Error reading visibility from AsyncStorage:", error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#121212",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        style={{
          width: 200,
          height: 200,
        }}
        source={require("../assets/parrotLogo.png")}
      />
    </SafeAreaView>
  );
}
