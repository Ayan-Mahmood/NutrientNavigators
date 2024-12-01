import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "../components/pages/registerPage";
import Login from "../components/pages/loginPage";
import landingPage from "../components/pages/landingPage";
import HomePage from "../components/pages/homePage";
import UploadScreen from "../components/pages/uploadScreen";
import SetGoalsPage from "../components/pages/SetGoalsPage";
import ViewUserProfile from "../components/pages/viewUserProfile";
import EditUserProfile from "../components/pages/editUserProfile";
import ShareUserProfile from "../components/pages/shareUserProfile";
import ViewMealSuggestions from "../components/pages/viewMealSuggestions";
import DailySummaryScreen from "../components/pages/dailySummaryScreen";
// import PredictionScreen from "../components/pages/predictionScreen";
// import OverrideScreen from "../components/pages/overrideScreen";
type AccountInfo = {
  age: string;
  biological_sex: string;
  goal: string;
  height: string;
  id: string;
  name: string;
  weight: string;
};
export type RootStackParamList = {
  LoginPage: undefined;
  landingPage: undefined;
  Login: AccountInfo;
  Register: AccountInfo;
  HomePage: AccountInfo;
  MealLogger: AccountInfo;
  ProgressPage: AccountInfo;
  SetGoalsPage: AccountInfo;
  ViewUserProfile: AccountInfo;
  EditUserProfile: AccountInfo;
  ShareUserProfile: AccountInfo;
  ViewMealSuggestions: AccountInfo;
  Upload: undefined;
  Prediction: { foodItems: { name: string; confidence: number }[] };
  Override: { originalFood: string };
  DailySummaryScreen: AccountInfo;
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
          options={{ title: "Upload Food Image" }}
          name="Upload"
          component={UploadScreen}
        />
        <Stack.Screen
          options={{ title: "Set Goals" }}
          name="SetGoalsPage"
          component={SetGoalsPage}
        />
        <Stack.Screen
          options={{ title: "Your Profile" }}
          name="ViewUserProfile"
          component={ViewUserProfile}
        />
        <Stack.Screen
          options={{ title: "Edit Profile" }}
          name="EditUserProfile"
          component={EditUserProfile}
        />
          <Stack.Screen
          options={{ title: "Share Profile" }}
          name="ShareUserProfile"
          component={ShareUserProfile}
          />
        <Stack.Screen
          options={{ title: "Meal Suggestions" }}
          name="ViewMealSuggestions"
          component={ViewMealSuggestions}
        />
        <Stack.Screen
          options={{ title: "Daily Summary" }}
          name="DailySummaryScreen"
          component={DailySummaryScreen}
        />
        {/* <Stack.Screen
          options={{ title: "Prediction Results" }}
          name="Prediction"
          component={PredictionScreen}
        />
        <Stack.Screen
          options={{ title: "Override Prediction" }}
          name="Override"
          component={OverrideScreen}
        /> */}
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
