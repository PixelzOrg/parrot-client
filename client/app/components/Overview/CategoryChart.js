import { View, Text } from "react-native";
import { categoryColor, categorySymbol } from "../Memories/Memory";

export default function CategoryChart(props) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: categoryColor(props.category),
          fontWeight: "bold",
        }}
      >
        {categorySymbol(props.category)}
      </Text>
      <Text style={{ fontSize: 11, color: "white" }}>{props.category}</Text>
    </View>
  );
}
