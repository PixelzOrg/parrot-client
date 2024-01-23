import {
  Text,
  View,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { deleteUser } from "firebase/auth";
import BrutalismButton from "../components/BrutalismButton";
import * as Linking from "expo-linking";

export default function Settings() {
  const handleDelete = () => {
    const user = FIREBASE_AUTH.currentUser;
    deleteUser(user)
      .then(() => {
        Alert.alert("Your Account has been Deleted");
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };

  const handleSignOut = () => {
    FIREBASE_AUTH.signOut();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#121212",
      }}
    >
      <Image
        style={{
          alignSelf: "center",
          height: 250,
          width: 250,
        }}
        source={require("../assets/together.png")}
      />
      <BrutalismButton
        onPress={() => Linking.openURL("https://discord.gg/4jtzQanXFD")}
        text="Discord"
      />
      <BrutalismButton
        onPress={() =>
          Linking.openURL(
            "https://docs.google.com/document/d/1xvpGOa1KtploGtGD0KsV6E6rfesm6ShclisTih96ti0/edit?usp=sharing"
          )
        }
        bgColor="#0096FF"
        text="Privacy Policy"
      />
      <BrutalismButton
        onPress={() =>
          Alert.alert(
            "Are you sure you want to Sign Out of your account?",
            "",
            [{ text: "Sign Out", onPress: handleSignOut }, { text: "Cancel" }]
          )
        }
        bgColor="#fbdc14"
        text="Sign Out"
      />
      <BrutalismButton
        onPress={() =>
          Alert.alert(
            "Are you sure you want to delete your account?",
            "Deleting your account will delete all data related to this account and can not be retrieved after deletion.",
            [
              { text: "Delete Account", onPress: handleDelete },
              { text: "Cancel" },
            ]
          )
        }
        backgroundColor="red"
        text="Delete Account"
      />
    </SafeAreaView>
  );
}
