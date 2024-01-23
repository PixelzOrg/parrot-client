import { View, Text } from "react-native";

export default function Container(props) {
  return (
    <View
      style={[
        {
          backgroundColor: props.color || "rgba(40, 40, 40, 0.01)",
          flex: 1,
          width: props.width || "100%",
          height: props.height || "auto",
          minHeight: 150,
          marginTop: 20,
          borderBottomRightRadius: 2,
          borderBottomLeftRadius: 2,
          borderWidth: 1,
          borderColor: "rgb(80, 80, 80)",
          overflow: "hidden",
        },
        props.style,
      ]}
    >
      <View
        style={{
          backgroundColor: "rgba(20, 20, 20, 1)",
          height: 50,
          justifyContent: "center",
          borderColor: "rgba(255, 255, 255, 0.1)",
          shadowColor: props.shadowColor || "white",
          shadowOpacity: 1,
          shadowRadius: 3,
          shadowOffset: {
            height: -0.5,
            width: 0,
          },
          borderWidth: 1,
        }}
      >
        <Text
          style={{
            marginHorizontal: 10,
            color: "white",
            fontSize: 22,
          }}
        >
          {props.title}
        </Text>
      </View>
      {props.content}
    </View>
  );
}
