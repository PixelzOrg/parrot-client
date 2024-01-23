import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import OpenAI from "openai";
import { Feather } from "@expo/vector-icons";
import { GiftedChat } from "react-native-gifted-chat";
import { addToSQLChatHistory, getSQLChatHistory } from "../scripts/Database";
import { sendParrotChatMessage } from "../scripts/Parrot";

export default function Chat() {
  const [data, setData] = useState([]);
  const [textInput, setTextInput] = useState("");

  useEffect(() => {
    updateChatHistory();
  });

  async function replaceKeyNames() {
    const newObj = {};
    let chat = await getSQLChatHistory();

    chat.forEach((obj) => {
      newObj.role = obj.sender;
      newObj.content = obj.message;
    });
    console.log(newObj);
    return newObj;
  }

  async function messageSend() {
    await addToSQLChatHistory({
      sender: "user",
      message: textInput,
    });
    updateChatHistory();

    await addToSQLChatHistory({
      sender: "bot",
      message: JSON.parse(
        await sendParrotChatMessage(textInput, await replaceKeyNames())
      ).chat,
    });
    updateChatHistory();

    setTextInput("");
  }

  async function updateChatHistory() {
    let cleanPack = [];

    let chat = await getSQLChatHistory();
    //console.log(memories);

    chat.forEach((element) => {
      let object = {
        date: element.date,
        time: element.time,
        sender: element.sender,
        message: element.message,
      };

      cleanPack = [object, ...cleanPack];
      //console.log(object);
    });

    //console.log(cleanPack);
    setData(cleanPack);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          style={styles.body}
          inverted={true}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "column",
                padding: 15,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems:
                    item.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#121212",
                    maxWidth: 250,
                    minWidth: 10,
                    minHeight: 40,
                    justifyContent: "center",
                    borderRadius: 2,
                    borderWidth: 1,
                    borderColor: "rgba(80, 80, 80, 0.3)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "white",
                      marginHorizontal: 20,
                      marginVertical: 10,
                    }}
                  >
                    {item.message}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "grey",
                      marginHorizontal: 20,
                      marginVertical: 10,
                      justifyContent: "flex-end",
                    }}
                  >
                    {item.date + "     " + item.time}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            value={textInput}
            placeholderTextColor={"#404040"}
            onChangeText={(text) => setTextInput(text)}
            placeholder="Ask me anything"
          />
          <TouchableOpacity style={styles.button} onPress={messageSend}>
            <Feather name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    backgroundColor: "#121212",
  },
  body: {
    backgroundColor: "#121212",
    width: "100%",
  },
  inputGroup: {
    backgroundColor: "#121212",
    width: "100%",
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
    marginVertical: 20,
  },
  input: {
    width: "75%",
    height: "65%",
    marginVertical: "1%",
    marginHorizontal: "2%",
    color: "white",
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginVertical: "1%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "blue",
  },
});
