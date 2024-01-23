import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Overview from "../../screens/Overview";
import Memories from "../../screens/Memories";
import {
  FontAwesome5,
  Entypo,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import Capture from "../../screens/Capture";
import Settings from "../../screens/Settings";
import Chat from "../../screens/Chat";
import MemoryPageScreen from "../../screens/MemoryPageScreen";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../../screens/Profile";

const TopTabs = createMaterialTopTabNavigator();

export default function TopBar() {
  const tabColor = "#FFF";
  return (
    <TopTabs.Navigator
      initialRouteName="capture"
      screenOptions={{
        tabBarLabelStyle: {
          textTransform: "capitalize",
          fontWeight: "bold",
        },
        tabBarStyle: {
          height: 70,
          backgroundColor: "#181818",
        },
        tabBarIndicatorStyle: {
          height: 5,
          borderRadius: 5,
          position: "top",
          backgroundColor: tabColor,
        },
        tabBarIconStyle: {
          width: 75,
          height: 75,
          alignItems: "center",
        },
        tabBarActiveTintColor: tabColor, // Set your active icon color here
        tabBarInactiveTintColor: "#404040", // Set your inactive icon color here
      }}
      tabBarPosition="bottom"
    >
      <TopTabs.Screen
        name="home"
        component={MemoryStackGroup}
        options={{
          tabBarIcon: (params) => (
            <Entypo name="home" size={30} color={params.color} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <TopTabs.Screen
        name="capture"
        component={Capture}
        options={{
          tabBarIcon: (params) => (
            <Entypo name="camera" size={29} color={params.color} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <TopTabs.Screen
        name="chat"
        component={Chat}
        options={{
          tabBarIcon: (params) => (
            <MaterialIcons name="chat-bubble" size={29} color={params.color} />
          ),
          tabBarShowLabel: false,
        }}
      />
    </TopTabs.Navigator>
  );
}

const MemoryStack = createNativeStackNavigator();
function MemoryStackGroup() {
  return (
    <MemoryStack.Navigator>
      <MemoryStack.Screen
        name="Overview"
        component={Overview}
        options={{
          headerShown: false,
        }}
      />
      <MemoryStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#181818",
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTintColor: "white",
        }}
        name="Settings"
        component={Settings}
      />
      <MemoryStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#181818",
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTintColor: "white",
        }}
        name="MemoryPageScreen"
        component={MemoryPageScreen}
      />
      <MemoryStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#181818",
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTintColor: "white",
        }}
        name="Profile"
        component={Profile}
      />
    </MemoryStack.Navigator>
  );
}
