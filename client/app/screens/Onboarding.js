import {
  View,
  Text,
  SafeAreaView,
  Button,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import PagerView from "react-native-pager-view";
import {
  Entypo,
  AntDesign,
  FontAwesome,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import BrutalismButton from "../components/BrutalismButton";
import { Camera } from "expo-camera";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { useState, useRef } from "react";

export const hideOnboarding = async () => {
  try {
    // Update the value in AsyncStorage
    await AsyncStorage.setItem("visibility", JSON.stringify(false));
  } catch (error) {
    console.error("Error setting visibility in AsyncStorage:", error);
  }
};

export default function Onboarding() {
  const { navigate } = useNavigation();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const [hasMediaLibraryPermission, sethasMediaLibraryPermission] =
    useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const viewPagerRef = useRef(null);

  const nav = () => {
    hideOnboarding();
    navigate("TabGroup", {});
  };

  const cameraPermissions = async () => {
    const cameraPermision = await Camera.requestCameraPermissionsAsync();
    const microphonePermision =
      await Camera.requestMicrophonePermissionsAsync();
    setHasCameraPermission(cameraPermision.status === "granted");
    setHasMicrophonePermission(microphonePermision.status === "granted");
    continueBtn();
  };

  const audioPermissions = async () => {
    const audioPermission = await Audio.requestPermissionsAsync().then(
      (permission) => {
        setAudioPermission(permission.granted);
      }
    );
    continueBtn();
  };

  const galleryPermissions = async () => {
    const galleryPermission = await MediaLibrary.requestPermissionsAsync();
    sethasMediaLibraryPermission(galleryPermission.status === "granted");
    continueBtn();
  };

  const locationPermissions = async () => {
    const locationPermission =
      await Location.requestForegroundPermissionsAsync();
    setLocationPermission(locationPermission.status === "granted");
    continueBtn();
  };

  const continueBtn = async () => {
    const test =
      hasCameraPermission &&
      hasMicrophonePermission &&
      hasMediaLibraryPermission &&
      audioPermission &&
      locationPermission;
    setAllComplete(test);
  };

  const handleButtonPress = (index) => {
    viewPagerRef.current.setPage(index);
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#121212",
        flex: 1,
      }}
    >
      <PagerView ref={viewPagerRef} style={{ flex: 1 }} initialPage={0}>
        <View style={styles.page} key="1">
          <Image
            style={styles.image}
            source={require("../assets/capture.png")}
          />
          <View style={styles.bottom}>
            <View>
              <Text style={styles.title}>Record Everything</Text>
              <Text style={styles.description}>
                Capture memories either with your camera, recording audio, or
                even uploading your own videos from any capture device.
              </Text>
            </View>
            <View>
              <BrutalismButton
                text="Next"
                onPress={() => handleButtonPress(1)}
              />
            </View>
          </View>
        </View>
        <View style={styles.page} key="2">
          <Image
            style={styles.image}
            source={require("../assets/recall.png")}
          />
          <View style={styles.bottom}>
            <View>
              <Text style={styles.title}>Recall Memories</Text>
              <Text style={styles.description}>
                Parrot makes it easy for you to sort and locate your memories
                faster. Parrot also has an AI Chat for you to ask specific
                questions about your memories.
              </Text>
            </View>
            <View>
              <BrutalismButton
                text="Next"
                onPress={() => handleButtonPress(2)}
              />
            </View>
          </View>
        </View>
        <View style={styles.page} key="3">
          <Image
            style={[
              styles.image,
              {
                height: 100,
                width: "75%",
              },
            ]}
            source={require("../assets/pichart.png")}
          />
          <View style={styles.bottom}>
            <View>
              <Text style={styles.title}>Review & Repeat</Text>
              <Text style={styles.description}>
                Each day, you'll receive an automated daily diary summarizing
                your activities and a chart to gauge how you spend your day.
              </Text>
            </View>
            <View>
              <BrutalismButton
                text="Next"
                onPress={() => handleButtonPress(3)}
              />
            </View>
          </View>
        </View>
        <View style={styles.page} key="4">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Entypo name="lock" size={240} color="white" />
          </View>
          <View style={styles.bottom}>
            <View>
              <Text style={styles.title}>Privacy First</Text>
              <Text style={styles.description}>
                Since day one, safeguarding your privacy has been our priority.
                That's why we store all your memories locally, ensuring none of
                your data is stored elsewhere.
              </Text>
            </View>
            <View>
              <BrutalismButton
                text="Next"
                onPress={() => handleButtonPress(4)}
              />
            </View>
          </View>
        </View>
        <View style={styles.page} key="5">
          <View
            style={{
              flex: 0.6,
              justifyContent: "flex-end",
            }}
          >
            <Text style={styles.title}>Ready for Perfect Memory?</Text>
          </View>
          <View style={styles.bottom}>
            <View
              style={[
                styles.description,
                {
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                },
              ]}
            >
              <Pressable
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: 300,
                  alignItems: "center",
                }}
                onPress={cameraPermissions}
              >
                <View style={styles.icon}>
                  <Entypo name="camera" size={24} color="white" />
                </View>
                <Text style={styles.permissions}>
                  We need access to your camera
                </Text>
                <FontAwesome5
                  name={hasCameraPermission ? "check-circle" : "circle"}
                  size={24}
                  color="white"
                />
              </Pressable>
              <Pressable
                onPress={audioPermissions}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: 300,
                  alignItems: "center",
                }}
              >
                <View style={styles.icon}>
                  <FontAwesome name="microphone" size={24} color="white" />
                </View>
                <Text style={styles.permissions}>
                  We need access to your audio
                </Text>
                <FontAwesome5
                  name={audioPermission ? "check-circle" : "circle"}
                  size={24}
                  color="white"
                />
              </Pressable>
              <Pressable
                onPress={galleryPermissions}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: 300,
                  alignItems: "center",
                }}
              >
                <View style={styles.icon}>
                  <FontAwesome name="photo" size={24} color="white" />
                </View>
                <Text style={styles.permissions}>
                  We need access to your gallery
                </Text>
                <FontAwesome5
                  name={hasMediaLibraryPermission ? "check-circle" : "circle"}
                  size={24}
                  color="white"
                />
              </Pressable>
              <Pressable
                onPress={locationPermissions}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: 300,
                  alignItems: "center",
                }}
              >
                <View style={styles.icon}>
                  <Ionicons name="earth-sharp" size={24} color="white" />
                </View>
                <Text style={styles.permissions}>
                  We need access to your location
                </Text>
                <FontAwesome5
                  name={locationPermission ? "check-circle" : "circle"}
                  size={24}
                  color="white"
                />
              </Pressable>
            </View>
            {allComplete && (
              <View
                style={{
                  flex: 0.5,
                  width: 200,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <BrutalismButton text="Yes" onPress={nav} />
              </View>
            )}
            {!allComplete && (
              <View
                style={{
                  flex: 0.5,
                  width: 200,
                }}
              ></View>
            )}
          </View>
        </View>
      </PagerView>
    </SafeAreaView>
  );
}

//Put this on last page
//<Button title="test" onPress={nav} />

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
  page: {
    alignItems: "center",
  },
  title: {
    color: "white",
    marginHorizontal: 40,
    fontSize: 30,
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold",
  },
  description: {
    color: "white",
    marginHorizontal: 40,
    marginVertical: 10,
    fontSize: 16,
    textAlign: "center",
    height: 100,
    flex: 0.55,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    flex: 1,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  permissions: {
    color: "white",
    textAlign: "left",
  },
  icon: {
    height: 25,
    width: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
