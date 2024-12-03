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
      <Text style={styles.welcome}>
        Welcome back, {AccountInfo.user_profile.name}!
      </Text>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonSpacing}>
          <Button
            title="Generate Meals"
            onPress={() =>
              navigation.navigate("ViewMealSuggestions", { AccountInfo })
            }
          />
        </View>

        {/* Log Meal Button to Navigate to Upload Screen */}
        <View style={styles.buttonSpacing}>
          <Button
            title="Log Your Meal"
            onPress={() => 
              navigation.navigate("Upload", { AccountInfo })
            }
          />
        </View>

        {/* WE ARE GOING TO ADD AN EDIT GOALS PAGE HERE*/}

        <View style={styles.buttonSpacing}>
          <Button
            title="View Profile"
            onPress={() =>
              navigation.navigate("ViewUserProfile", { AccountInfo })
            }
          />
        </View>

        <View style={styles.buttonSpacing}>
          <Button
            title="View Daily Summary"
            onPress={() => 
              navigation.navigate("DailySummaryScreen", { AccountInfo })
            }
          />
        </View>                    
        <View style={styles.buttonSpacing}>
          < Button  
            title="Share Your Journal"
            onPress={() =>
              navigation.navigate("ShareUserProfile", { AccountInfo })
            }
          />
        </View>

        {/* Logout Button */}
        <View style={styles.buttonSpacing}>
          <Button
            title="Logout"
            color="red"
            onPress={() => navigation.replace("LoginPage")}
          />
        </View>
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
    width: "80%", // Optional: Set button width for consistency
  },
});

export default HomePage;
