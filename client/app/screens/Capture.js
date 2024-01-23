import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { Camera } from "expo-camera";
import { Video, Audio } from "expo-av";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  addNewDBMemory,
  getSQLDailySummary,
  returnAllMemoriesFromDB,
} from "../scripts/Database";
import moment from "moment";
import * as Location from "expo-location";
import { setParrotDailySummary } from "../scripts/Parrot";
import { setVisibility } from "../scripts/Tools";

export default function Capture() {
  //Camera stuff -----------------------------------------------------------------
  let cameraRef = useRef();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();
  const [recordingAudio, setAudioRecording] = useState(null);
  const [recordingAudioStatus, setAudioRecordingStatus] = useState("idle");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTIme] = useState("");
  const [date, setDate] = useState(new Date());

  //Ask for permissionss
  useEffect(() => {
    // Cleanup upon first render
    return () => {
      if (recordingAudio) {
        stopAudioRecording();
      }
    };
  }, []);

  //Make new memory with correct data
  async function uploadVideoWithMetaData(videoURI) {
    try {
      const videoUri = videoURI;
      console.log(videoUri);
      setVisibility("processing-memory", true);

      // Get creation time
      const fileInfo = await FileSystem.getInfoAsync(videoUri);
      const creationDate = fileInfo.modificationTime; // This is an approximation

      // Get video duration
      //TODO

      console.log("Video Creation Date:", creationDate);

      //Get location
      let currentLocation = await Location.getCurrentPositionAsync({});
      const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
        longitude: currentLocation.coords.longitude,
        latitude: currentLocation.coords.latitude,
      });
      console.log(currentLocation);
      let loc = reverseGeocodedAddress[0];
      let upper = loc.region.toUpperCase();
      let locName = loc.city + ", " + upper;
      console.log("location: " + locName);

      setDate(new Date());
      addNewDBMemory(
        "Romantic Movie Night",
        "Health & Travel",
        moment(date).format("HH:mm"),
        moment(date).add(3, "minutes").format("HH:mm"),
        moment(date).format("YYYY-MM-DD"),
        "sum",
        locName,
        videoUri,
        "transcript",
        currentLocation.coords.longitude || 360,
        currentLocation.coords.latitude || 360,
        "Dating/Partner"
      );
      setVisibility("processing-memory", false);

      createDailySummary();
    } catch (error) {
      console.error("Error getting video metadata:", error);
    }
  }

  //Do video recording magic
  let recordVideo = async () => {
    setIsRecording(true);
    let options = {
      quality: "1080p",
      mute: false,
    };

    cameraRef.current.recordAsync(options).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
      MediaLibrary.saveToLibraryAsync(recordedVideo.uri).then(async () => {
        uploadVideoWithMetaData(recordedVideo.uri);
        setVideo(undefined);
      });
    });
  };

  let stopVideoRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
    if (video)
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        setVideo(undefined);
      });
  };

  let uploadGalleryVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
      //videoQuality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      uploadVideoWithMetaData(result.assets[0].uri);
      setVideo(undefined);
    }
  };

  //Microphone audio Stuff -----------------------------------------------------------------

  async function startAudioRecording() {
    try {
      // needed for IoS
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      console.log("Starting Recording");
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();
      setAudioRecording(newRecording);
      setAudioRecordingStatus("recording");
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  }

  async function stopAudioRecording() {
    try {
      if (recordingAudioStatus === "recording") {
        console.log("Stopping Recording");
        await recordingAudio.stopAndUnloadAsync();
        const recordingUri = recordingAudio.getURI();

        // Create a file name for the recording
        const fileName = `recording-${Date.now()}.caf`;

        // Move the recording to the new directory with the new file name
        await FileSystem.makeDirectoryAsync(
          FileSystem.documentDirectory + "recordings/",
          { intermediates: true }
        );
        await FileSystem.moveAsync({
          from: recordingUri,
          to: FileSystem.documentDirectory + "recordings/" + `${fileName}`,
        });

        // This is for simply playing the sound back
        const playbackObject = new Audio.Sound();
        await playbackObject.loadAsync({
          uri: FileSystem.documentDirectory + "recordings/" + `${fileName}`,
        });
        await playbackObject.playAsync();

        // resert our states to record again
        setAudioRecording(null);
        setAudioRecordingStatus("stopped");
      }
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  }

  async function handleRecordButtonPress() {
    if (recordingAudio) {
      const audioUri = await stopAudioRecording(recordingAudio);
      if (audioUri) {
        console.log("Saved audio file to", savedUri);
      }
    } else {
      await startAudioRecording();
    }
  }

  //UI Stuff -----------------------------------------------------------------
  //Default camera open state
  let bgColor = "#181818";
  return (
    <Camera style={styles.container} ref={cameraRef}>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 50,
          left: 80,
          width: 44,
          height: 44,
          backgroundColor: bgColor,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 25,
        }}
        onPress={uploadGalleryVideo}
      >
        <FontAwesome name="picture-o" size={24} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 50,
          center: 0,
          width: 80,
          height: 80,
          backgroundColor: isRecording ? "red" : bgColor,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 40,
        }}
        onPress={isRecording ? stopVideoRecording : recordVideo}
      >
        <FontAwesome5
          name={isRecording ? "video-slash" : "video"}
          size={40}
          color="#FFF"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 50,
          right: 80,
          width: 44,
          height: 44,
          backgroundColor: recordingAudio ? "red" : bgColor,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 25,
        }}
        onPress={handleRecordButtonPress}
      >
        <FontAwesome
          name={recordingAudio ? "microphone-slash" : "microphone"}
          size={24}
          color="#FFF"
        />
      </TouchableOpacity>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    flex: 1,
    alignSelf: "stretch",
  },
});

async function createDailySummary() {
  let cleanPack = [];

  let memories = await returnAllMemoriesFromDB();
  //console.log(memories);

  memories.forEach((element) => {
    let object = {
      title: element.title,
      location: element.location,
      time:
        "Time Start: " + element.timeStart + " Time End: " + element.timeEnd,
      video_context: "No video available",
      summary: element.summary,
      transcription: element.transcript,
    };

    cleanPack = [...cleanPack, object];
    //console.log(object);
  });

  //console.log(cleanPack);
  await setParrotDailySummary(cleanPack);
  let summary = await getSQLDailySummary();
  console.log(summary[0].daysummary);
}
