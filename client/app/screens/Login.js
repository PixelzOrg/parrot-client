import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
      alert("check your emails");
    } catch (error) {
      console.log(error);
      alert("Sign up failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          marginTop: 80,
        }}
        behavior="padding"
      >
        <Image
          style={{
            alignSelf: "center",
            height: 200,
            width: 200,
          }}
          source={require("../assets/parrotLogo.png")}
        />
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 32,
          }}
        >
          Parrot
        </Text>
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 18,
            marginBottom: 20,
          }}
        >
          Your Solution to Perfect Memory
        </Text>
        <TextInput
          value={email}
          placeholderTextColor={"#404040"}
          style={[
            styles.input,
            {
              marginHorizontal: 20,
            },
          ]}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <TextInput
          placeholderTextColor={"#404040"}
          secureTextEntry={true}
          value={password}
          style={[
            styles.input,
            {
              marginHorizontal: 20,
            },
          ]}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        ></TextInput>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button
              style={{ backgroundColor: "white" }}
              title="Login"
              onPress={signIn}
            />
            <Button title="Create Account" onPress={signUp} />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginVertical: 5,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#181818",
    color: "#FFF",
  },
});
