import { useNavigation } from "@react-navigation/native";
import { View, Text, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function Memory(props) {
  const { navigate } = useNavigation();

  const onPressablePress =
    props.disabled === "true"
      ? null
      : () => navigate("MemoryPageScreen", { props });

  return (
    <Pressable
      style={{
        backgroundColor: "#282828",
        height: 50,
        marginHorizontal: 15,
        marginVertical: 5,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5,
        shadowColor: categoryColor(props.category),
        shadowOpacity: 0.8,
        shadowRadius: 3,
        shadowOffset: {
          height: 0,
          width: 0,
        },
        borderColor: categoryColor(props.category),
        borderWidth: 1,
        justifyContent: "space-between",
      }}
      onPress={onPressablePress}
    >
      <View
        style={{
          width: 35,
          height: 35,
          marginHorizontal: 10,
          backgroundColor: categoryColor(props.category),
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {props.videoURI ? (
          <FontAwesome name="camera" size={24} color="black" />
        ) : (
          <FontAwesome name="microphone" size={24} color="black" />
        )}
      </View>
      <Text
        style={{
          textTransform: "capitalize",
          color: "white",
          //fontFamily: "lucida grande",
          flex: 1,
        }}
        numberOfLines={1}
      >
        {props.title}
      </Text>
      <View
        style={{
          flexDirection: "row",
          height: "100%",
          alignItems: "center",
          marginHorizontal: 10,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            marginHorizontal: 5,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              marginVertical: 5,
              textAlign: "right",
              color: "white",
            }}
          >
            {props.timeEnd || "00:00AM"}
          </Text>
          <Text
            style={{
              fontSize: 10,
              marginVertical: 5,
              textAlign: "right",
              color: "white",
            }}
          >
            {props.timeStart || "00:00PM"}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: categoryColor(props.social),
            width: 5,
            height: "80%",
          }}
        />
      </View>
    </Pressable>
  );
}

export function categoryColor(category) {
  switch (category) {
    case "Family":
      return "#0080ff";
    case "Friends":
      return "#00ff80";
    case "Dating/Partner":
      return "#ff00ff";
    case "School":
      return "#00ffff";
    case "Work":
      return "#00ff00";
    case "Productive":
      return "#ffff00";
    case "Hobbies & Skills":
      return "#fe7e0f";
    case "Relaxation & Leisure":
      return "#8000ff";
    case "Health & Travel":
      return "#ff0080";
    case "Sleep":
      return "#414141";
    case "Waste":
      return "#ff0000";
    case "Processing":
      return "grey";
    case "Not Recorded":
      return "#FFFFFF";
    default:
      return "#FFFFFF";
  }
}

export function categorySymbol(category) {
  switch (category) {
    case "Friends":
    case "Family":
    case "Dating/Partner":
      return "▢ ";

    default:
      return "○ ";
  }
}
