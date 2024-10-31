import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "../components/pages/registerPage";
import Login from "../components/pages/loginPage";
import landingPage from "../components/pages/landingPage";
import HomePage from "../components/pages/homePage";
import SetGoalsPage from "../components/pages/SetGoalsProps";
export type RootStackParamList = {
  LoginPage: undefined;
  landingPage: undefined;
  Login: { AccountInfo: { id: string; email: string } };
  Register: { AccountInfo: { id: string; email: string } };
  HomePage: { AccountInfo: { id: string; email: string } };
  SetGoalsPage: { AccountInfo: { id: string; email: string } };
  ProgressPage: { AccountInfo: { id: string; email: string } };
};
const Stack = createNativeStackNavigator<RootStackParamList>();
export function Registration_Login_Page({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.text}>Register</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.text}>Login</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="landingPage">
        <Stack.Screen
          options={{ title: "Register / Log-in" }}
          name="LoginPage"
          component={Registration_Login_Page}
        />
        <Stack.Screen
          options={{ title: "Register" }}
          name="Register"
          component={Register}
        />
        <Stack.Screen
          options={{ title: "Login" }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{ title: "Nutrient Navigators" }}
          name="landingPage"
          component={landingPage}
        />
        <Stack.Screen
          options={{ title: "Home Page" }}
          name="HomePage"
          component={HomePage}
        />
        <Stack.Screen
          options={{ title: "Set Goals" }}
          name="SetGoalsPage"
          component={SetGoalsPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
registerRootComponent(App);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    alignItems: "center",
    gap: 50,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
});
