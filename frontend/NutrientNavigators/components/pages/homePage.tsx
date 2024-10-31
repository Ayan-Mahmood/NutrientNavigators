import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../app/index";

type HomePageProps = StackScreenProps<RootStackParamList, "HomePage">;

const HomePage: React.FC<HomePageProps> = ({ navigation, route }) => {
  const { AccountInfo } = route.params;

  // Ensure account data is provided; otherwise, redirect to the login page
  useEffect(() => {
    if (!AccountInfo || !AccountInfo.id || !AccountInfo.email) {
      Alert.alert(
        "Unauthorized Access",
        "You must be logged in to access this page.",
        [{ text: "OK", onPress: () => navigation.replace("LoginPage") }]
      );
    }
  }, [AccountInfo, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome back, {AccountInfo.email}!</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Set Personal Information and Goals"
          onPress={() => navigation.navigate("SetGoalsPage", { AccountInfo })}
        />
        <Button
          title="View Progress"
          onPress={() => navigation.navigate("ProgressPage", { AccountInfo })}
        />
        <Button
          title="Logout"
          color="red"
          //should also clear AccountInfo
          onPress={() => navigation.replace("LoginPage")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  buttonSpacing: {
    marginVertical: 10,
  },
});

export default HomePage;
