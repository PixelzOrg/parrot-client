import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { View, Text } from "react-native";
import { Video } from "expo-av";
import Container from "../components/Container";
import MapView, { Marker } from "react-native-maps";
import { categoryColor, categorySymbol } from "../components/Memories/Memory";
import * as Location from "expo-location";

export default function MemoryPageScreen({ navigation }) {
  const { navigate } = useNavigation();
  const route = useRoute();
  const { params } = route;
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

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
              color: "white",
            }}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {params.props.title.length < 28
              ? params.props.title
              : params.props.title.substring(0, 28) + "..."}
          </Text>
          <Text style={{ fontSize: 12, color: "white" }}>
            {params.props.timeStart} - {params.props.timeEnd}
          </Text>
        </View>
      ),
    });
  }, []);

  //console.log(params);

  //Video should be
  //source={{ uri: item.url }}

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#121212",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          marginHorizontal: 15,
          marginVertical: 10,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              flex: 0.5,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: categoryColor(params.props.category),
                fontWeight: "bold",
              }}
            >
              ○{" "}
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 16,
              }}
            >
              {params.props.category || "CATEGORY"}
            </Text>
          </View>
          <Text
            style={{
              textTransform: "capitalize",
              color: "white",
              fontSize: 14,
            }}
          >
            {params.props.location || "LOCATION"}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              flex: 0.5,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: categoryColor(params.props.social),
                fontWeight: "bold",
              }}
            >
              {categorySymbol(params.props.social)}
            </Text>
            <Text style={{ color: "white", fontSize: 12 }}>
              {params.props.social || "SOCIAL"}
            </Text>
          </View>
          <Text style={{ color: "white", fontSize: 12 }}>
            {params.props.date || "DATE"}
          </Text>
        </View>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginBottom: 20,
        }}
      >
        <Container
          title="Summary"
          shadowColor={categoryColor(params.props.category)}
          content={
            <Text style={{ color: "white" }}>
              {params.props.summary || "SUMMARY"}
            </Text>
          }
        />
        <Container
          title="Video"
          height={350}
          shadowColor={categoryColor(params.props.category)}
          content={
            <Video
              source={{ uri: params.props.videoURI }}
              style={{
                flex: 1,
                borderBottomEndRadius: 10,
                borderBottomStartRadius: 10,
              }}
              volume={1.0}
              rate={1.0}
              resizeMode="contain"
              shouldPlay
              isLooping
              isMuted={false}
            />
          }
        />
        {params.props.longitude != 360 && params.props.latitude != 360 && (
          <Container
            color="#e8f7a0"
            title="Location"
            height={300}
            shadowColor={categoryColor(params.props.category)}
            content={
              <MapView
                style={{
                  width: "100%",
                  height: "100%",
                  flex: 1,
                  borderRadius: 2,
                }}
                initialRegion={{
                  latitude: params.props.latitude,
                  longitude: params.props.longitude,
                  latitudeDelta: 0.01, // Adjust to a smaller value for more zoom
                  longitudeDelta: 0.01, // Adjust to a smaller value for more zoom
                }}
              >
                <Marker
                  coordinate={{
                    latitude: params.props.latitude,
                    longitude: params.props.longitude,
                  }}
                  title={params.props.title}
                  description={params.props.location}
                />
              </MapView>
            }
          />
        )}
        <Container
          title="Transcript"
          shadowColor={categoryColor(params.props.category)}
          content={
            <Text style={{ color: "white" }}>
              {params.props.transcript || "TRANSCRIPT"}
            </Text>
          }
        />
      </View>
    </ScrollView>
  );
}
