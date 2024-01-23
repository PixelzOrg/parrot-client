import Container from "../Container";
import { Text, View } from "react-native";

export default function DailySummary(props) {
  return (
    <Container
      style={{
        flex: 1,
        marginHorizontal: 5,
      }}
      width={"auto"}
      title="Daily Summary"
      content={
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              flex: 1,
              color: "white",
              marginHorizontal: 10,
              marginVertical: 10,
              fontSize: 15,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            {props.summary}
          </Text>
        </View>
      }
    />
  );
}
