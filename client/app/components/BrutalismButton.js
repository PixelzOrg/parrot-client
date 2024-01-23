import { TouchableOpacity, Text } from "react-native";

export default function BrutalismButton(props) {
  return (
    <TouchableOpacity
      style={{
        width: props.width || 150,
        height: props.height || 50,
        backgroundColor: props.backgroundColor || "#181818",
        padding: 10,
        justifyContent: "center",
        marginVertical: 20,
        borderRadius: 10,
        borderColor: props.backgroundColor || props.bgColor || "white",
        shadowColor: props.bgColor || "white",
        shadowOpacity: 1,
        shadowRadius: 4,
        shadowOffset: {
          height: 0,
          width: 0,
        },
      }}
      onPress={props.onPress}
    >
      <Text
        style={{
          color: props.textColor || "white",
          fontWeight: "bold",
          alignSelf: "center",
        }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}
