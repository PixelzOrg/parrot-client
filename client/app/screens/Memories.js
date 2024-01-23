import { useEffect, useState } from "react";
import {
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import EmptyState from "../components/Memories/EmptyState";
import { Uploading } from "../components/Memories/Uploading";
import axios from "axios";
import Memory from "../components/Memories/Memory";
import { AntDesign } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { returnAllMemoriesFromDB } from "../scripts/Database";
import PickDayButton from "../components/PickDayButton";
import { useNavigation } from "@react-navigation/native";

export default function Memories({ navigation }) {
  const [image, setimage] = useState("");
  const [video, setvideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const db = SQLite.openDatabase("parrot.db");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("2024-01-16");
  const [memoryObject, setMemoryObject] = useState({
    title: "Swimming",
    category: "waste",
    timeStart: "03:00",
    timeEnd: "04:00",
    date: "2024-01-18",
    summary: "w",
    location: "g",
    videoURI: "",
    transcript: "a",
  });
  const { navigate } = useNavigation();

  useEffect(() => {
    //db.closeAsync();
    //db.deleteAsync();
    navigation.addListener("focus", () => {
      showAllMemoriesFromDB();
    });

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS memories (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, category TEXT, timeStart TEXT, timeEnd TEXT, date TEXT, summary TEXT, location TEXT, videoURI TEXT, transcript TEXT)"
      );
    });

    showAllMemoriesFromDB();

    setIsLoading(false);
    //getCategoryDistribution(db);
  }, []);

  if (isLoading) {
    return (
      <View>
        <Text>Loading memories...</Text>
      </View>
    );
  }

  async function showAllMemoriesFromDB() {
    let memories = await returnAllMemoriesFromDB();
    let dbMemories = [];
    memories.forEach((item) => {
      //console.log(item.id);
      dbMemories = [
        ...dbMemories,
        <Memory
          title={item.title}
          category={item.category}
          timeStart={item.timeStart}
          timeEnd={item.timeEnd}
          date={item.date}
          summary={item.summary}
          location={item.location}
          videoURI={item.videoURI}
          transcript={item.transcript}
        />,
      ];
    });
    setFiles(dbMemories);
  }

  function sendToNewMemoryPage() {
    navigate("CreateNewMemoryScreen", {});
  }

  function addNewMemory() {
    console.log("adding memory");

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO memories (title, category, timeStart, timeEnd, date, summary, location, videoURI, transcript) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          memoryObject.title,
          memoryObject.category,
          memoryObject.timeStart,
          memoryObject.timeEnd,
          memoryObject.date,
          memoryObject.summary,
          memoryObject.location,
          memoryObject.videoURI,
          memoryObject.transcript,
        ],
        (txObj, resultSet) => {
          setFiles([
            ...files,
            <Memory
              title={memoryObject.title}
              category={memoryObject.category}
              timeStart={memoryObject.timeStart}
              timeEnd={memoryObject.timeEnd}
              date={memoryObject.date}
              summary={memoryObject.summary}
              location={memoryObject.location}
              videoURI={memoryObject.videoURI}
              transcript={memoryObject.transcript}
            />,
          ]);
          setMemoryObject({
            title: "",
            category: "",
            timeStart: "",
            timeEnd: "",
            date: "",
            summary: "",
            location: "",
            videoURI: "",
            transcript: "",
          });
          showAllMemoriesFromDB();
        },
        (txObj, error) => console.log(error)
      );
    });

    /*setFiles([
      ...files,
      <Memory
        title="Sitting at Desk"
        timeStart="12:00 PM"
        timeEnd="1:00PM"
        category="work"
      />,
    ]);*/
  }

  async function uploadImage(uri, fileType) {
    const video = await fetch(uri);

    const videoBlob = await video.blob();

    const response = {
      message: "Presigned URL generated successfully",
      expires: 3600,
      video_uuid: "715ac38f-6db3-48fa-aff6-c00ea7a6dcd5",
      presigned_url: {
        url: "https://user-videos-bucket.s3.amazonaws.com/",
        fields: {
          key: "ginorey/715ac38f-6db3-48fa-aff6-c00ea7a6dcd5.mp4",
          "x-amz-algorithm": "AWS4-HMAC-SHA256",
          "x-amz-credential":
            "ASIAQMZWSSNHRI7U5C4M/20231223/us-east-2/s3/aws4_request",
          "x-amz-date": "20231223T191601Z",
          "x-amz-security-token":
            "IQoJb3JpZ2luX2VjEMP//////////wEaCXVzLWVhc3QtMiJGMEQCIEwOnmWUJiMN+yw9WtDVZx1WeD0CoQQqN7rQTzrr3wFIAiABLpmAgMhQs8ZEB8VULOcFoEvHY3SvykmxeVUKXgeSNyqlAwhMEAAaDDAyNzQ5NDg4MDA3OSIMp52sPml1nZu/5DmbKoIDRnSECFjRoby8VVihwPQUl6IuLaGuBeTcnMkTRY4cMGMJ0Srr3xQkgLcV/wNGKPHklGYiYOXP/eifg27rJyw9aF97iP+UgwJouMcYOBoIFtW/JMzIvDgARzRj+Xu6/mAqqdFo1XS8AoNloSJxM1XiInZAmTQ6CrIR8qq3vnALPWpMcsMGhHsBU7TSDFPg3CHmiKemT9h57YSnx5F4dEFS+V38egUaXbwlfckkVZob03yItd/H8aK0R5EakT1GX9pnpeNr6xubnh7XaGqcaIWAp+efGTs519RHQwCnFWnV/78oGPAXXQncMTTpQvU/Gq0PDBFuk6/yX4YTyfN3ryyzTwJLjD9Rh2gQ0wPTB5G96JsI2ufM0u51tnre2ojUU2sPpGoTO+XJqFiBLVNISo3MXtl5Bmfh0CwNJMslO9BCVxLA84NXYahQibJV8OhgoZ08cYZ3/lGPKo+gMKm116r899AES4yqh+cq7pLpCAG57oZCrhI6skLf7uYXTENUKQJVoUEw7uOcrAY6ngF76nYWEMbblaKVHJtuQpv6OYsekH9doSSfccjLZXLVjLziBYOqALOdQlhLRxdfQSo8zU3nZMFrMGtWjTANM+iIZLG/01s9sUgfCBr4iWvmFONz78jTUs159kifeUKAQOhx8kh+i/n4SZyeXe1Otiba1ZaP6V99slTbgxAKDuioGAtMduFF9b9uFYpjkYu6LlEBoXH5YIqh/Ky4EPIAmQ==",
          policy:
            "eyJleHBpcmF0aW9uIjogIjIwMjQtMDQtMTdUMTM6MDI6NDFaIiwgImNvbmRpdGlvbnMiOiBbeyJidWNrZXQiOiAidXNlci12aWRlb3MtYnVja2V0In0sIHsia2V5IjogImdpbm9yZXkvNzE1YWMzOGYtNmRiMy00OGZhLWFmZjYtYzAwZWE3YTZkY2Q1Lm1wNCJ9LCB7IngtYW16LWFsZ29yaXRobSI6ICJBV1M0LUhNQUMtU0hBMjU2In0sIHsieC1hbXotY3JlZGVudGlhbCI6ICJBU0lBUU1aV1NTTkhSSTdVNUM0TS8yMDIzMTIyMy91cy1lYXN0LTIvczMvYXdzNF9yZXF1ZXN0In0sIHsieC1hbXotZGF0ZSI6ICIyMDIzMTIyM1QxOTE2MDFaIn0sIHsieC1hbXotc2VjdXJpdHktdG9rZW4iOiAiSVFvSmIzSnBaMmx1WDJWakVNUC8vLy8vLy8vLy93RWFDWFZ6TFdWaGMzUXRNaUpHTUVRQ0lFd09ubVdVSmlNTit5dzlXdERWWngxV2VEMENvUVFxTjdyUVR6cnIzd0ZJQWlBQkxwbUFnTWhRczhaRUI4VlVMT2NGb0V2SFkzU3Z5a214ZVZVS1hnZVNOeXFsQXdoTUVBQWFEREF5TnpRNU5EZzRNREEzT1NJTXA1MnNQbWwxblp1LzVEbWJLb0lEUm5TRUNGalJvYnk4VlZpaHdQUVVsNkl1TGFHdUJlVGNuTWtUUlk0Y01HTUowU3JyM3hRa2dMY1Yvd05HS1BIa2xHWWlZT1hQL2VpZmcyN3JKeXc5YUY5N2lQK1Vnd0pvdU1jWU9Cb0lGdFcvSk16SXZEZ0FSelJqK1h1Ni9tQXFxZEZvMVhTOEFvTmxvU0p4TTFYaUluWkFtVFE2Q3JJUjhxcTN2bkFMUFdwTWNzTUdoSHNCVTdUU0RGUGczQ0htaUtlbVQ5aDU3WVNueDVGNGRFRlMrVjM4ZWdVYVhid2xmY2trVlpvYjAzeUl0ZC9IOGFLMFI1RWFrVDFHWDlwbnBlTnI2eHVibmg3WGFHcWNhSVdBcCtlZkdUczUxOVJIUXdDbkZXblYvNzhvR1BBWFhRbmNNVFRwUXZVL0dxMFBEQkZ1azYveVg0WVR5Zk4zcnl5elR3SkxqRDlSaDJnUTB3UFRCNUc5NkpzSTJ1Zk0wdTUxdG5yZTJvalVVMnNQcEdvVE8rWEpxRmlCTFZOSVNvM01YdGw1Qm1maDBDd05KTXNsTzlCQ1Z4TEE4NE5YWWFoUWliSlY4T2hnb1owOGNZWjMvbEdQS28rZ01LbTExNnI4OTlBRVM0eXFoK2NxN3BMcENBRzU3b1pDcmhJNnNrTGY3dVlYVEVOVUtRSlZvVUV3N3VPY3JBWTZuZ0Y3Nm5ZV0VNYmJsYUtWSEp0dVFwdjZPWXNla0g5ZG9TU2ZjY2pMWlhMVmpMemlCWU9xQUxPZFFsaExSeGRmUVNvOHpVM25aTUZyTUd0V2pUQU5NK2lJWkxHLzAxczlzVWdmQ0JyNGlXdm1GT056NzhqVFVzMTU5a2lmZVVLQVFPaHg4a2graS9uNFNaeWVYZTFPdGliYTFaYVA2Vjk5c2xUYmd4QUtEdWlvR0F0TWR1RkY5Yjl1RllwamtZdTZMbEVCb1hINVlJcWgvS3k0RVBJQW1RPT0ifV19",
          "x-amz-signature":
            "621681278b95fe8ca21da148edf9afc3910a4676505f1ff73575e3b04614a579",
        },
      },
    };

    const formData = new FormData();

    for (const key in response.presigned_url.fields) {
      formData.append(key, response.presigned_url.fields[key]);
    }

    formData.append("file", { uri: uri, name: "video.mp4", type: "video/mp4" });

    axios
      .post(response.presigned_url.url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(`File upload HTTP status response: ${response}`);
        console.log(`File upload HTTP status code: ${response.status}`);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);

        // Additional logging for debugging
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error(
            "No response received. Request details:",
            error.request
          );
        } else {
          console.error("Error setting up request:", error.message);
        }
      });

    setimage("");
    setvideo("");
    /*
        // listen for events
        uploadTask.on("state_changed",
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log("Upload is " + progress + "% done")
            setProgress(progress.toFixed())
        },
        (error) => {
            //handle error
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                console.log("File available at", downloadURL)
                // save record
                await saveRecord(fileType, downloadURL, new Date().toISOString())
                setimage("")
                setvideo("")
            })
        }
        )*/
  }

  /*async function saveRecord(fileType, url, createdAt) {
    try {
      const docRef = await addDoc(collection(db, "files"), {
        fileType,
        url,
        createdAt,
      });
      console.log("Document saved correctly", docRef.id);
    } catch (e) {
      console.log(e);
    }
  }*/

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {false && <PickDayButton otherOnChange={showAllMemoriesFromDB} />}

      {files.length == -1 && <EmptyState />}

      {files && (
        <FlatList
          data={files}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => {
            return item;
          }}
        />
      )}

      {(image || video) && (
        <Uploading image={image} video={video} progress={progress} />
      )}
      {false && (
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 50,
            right: 40,
            width: 60,
            height: 60,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 25,
          }}
          onPress={addNewMemory}
        >
          <AntDesign name="pluscircleo" size={60} color="black" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

export function addNewDBMemory(
  _title,
  _category,
  _timeStart,
  _timeEnd,
  _date,
  _summary,
  _location,
  _videoURI,
  _transcript
) {
  const db = SQLite.openDatabase("parrot.db");
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO memories (title, category, timeStart, timeEnd, date, summary, location, videoURI, transcript) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        _title,
        _category,
        _timeStart,
        _timeEnd,
        _date,
        _summary,
        _location,
        _videoURI,
        _transcript,
      ],
      (txObj, resultSet) => {
        console.log(
          _title,
          _category,
          _timeStart,
          _timeEnd,
          _date,
          _summary,
          _location,
          _videoURI,
          _transcript
        );
      },
      (txObj, error) => console.log(error)
    );
  });
}
