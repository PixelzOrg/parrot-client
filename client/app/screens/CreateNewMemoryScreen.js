import { SafeAreaView, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect } from "react";

export default function CreateNewMemoryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { params } = route;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
            numberOfLines={1}
          >
            Create a Memory
          </Text>
        </View>
      ),
    });
  }, []);

  return (
    <SafeAreaView>
      <Text>Test</Text>
    </SafeAreaView>
  );
}
