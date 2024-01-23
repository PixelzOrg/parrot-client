import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Settings from "./screens/Settings";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import TopBar from "./components/Navigation/TopBar.js";
import Chat from "./screens/Chat";
import CreateNewMemoryScreen from "./screens/CreateNewMemoryScreen";
import Onboarding from "./screens/Onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import Loading from "./screens/Loading";

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = async () => {
    try {
      // Read the value from AsyncStorage
      //await AsyncStorage.setItem("visibility", JSON.stringify(true));
      //const value = await AsyncStorage.getItem("visibility");
      // If value is null (first time), set to true; otherwise, parse the value
      //setIsVisible(value === null ? true : JSON.parse(value));
    } catch (error) {
      console.error("Error reading visibility from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    toggleVisibility();
  }, []); // Run only once when component mounts

  return (
    <InsideStack.Navigator>
      <InsideStack.Screen
        name="LoadingPage"
        options={{ headerShown: false }}
        component={Loading}
      />
      <InsideStack.Screen
        name="Onboarding"
        options={{ headerShown: false }}
        component={Onboarding}
      />
      <InsideStack.Screen
        name="TabGroup"
        options={{ headerShown: false }}
        component={TopBar}
      />
      <InsideStack.Screen
        name="CreateNewMemoryScreen"
        options={{ headerShown: true }}
        component={CreateNewMemoryScreen}
      />
    </InsideStack.Navigator>
  );
}

//Tab Bottom
const Tab = createBottomTabNavigator();

//Bottom tabs
function TabGroup() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: (params) => (
            <FontAwesome5 name="brain" size={24} color={params.color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: (params) => (
            <Ionicons name="chatbox-ellipses" size={24} color={params.color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: (params) => (
            <Ionicons name="settings" size={24} color={params.color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation(props) {
  const currentTheme = useColorScheme();
  return (
    <NavigationContainer
    //theme={currentTheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack.Navigator initialRouteName="Login">
        {props.user ? (
          <Stack.Screen
            name="Inside"
            component={InsideLayout}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
