import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

interface landingPageProps {
  navigation: any;
}

const landingPage: React.FC<landingPageProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Diet Analyzer!</Text>
      <Text style={styles.description}>
        The Diet Analyzer helps you track your daily food intake and provides
        insightful feedback on your dietary choices. Easily log your meals by
        taking photos, and receive detailed nutritional analysis to help you
        achieve your health goals.
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={() => navigation.navigate("LoginPage")}
        />
      </View>

      <Text style={styles.featuresTitle}>Key Features:</Text>
      <Text style={styles.featureItem}>
        1. User Registration and Profile Setup
      </Text>
      <Text style={styles.featureItem}>2. Daily Food Logging</Text>
      <Text style={styles.featureItem}>
        3. Nutritional Analysis and Feedback
      </Text>
      <Text style={styles.featureItem}>4. Progress Tracking</Text>
      <Text style={styles.featureItem}>5. Personalized Recommendations</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  featuresTitle: {
    display: "flex",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  featureItem: {
    display: "flex",
    justifyContent: "center",
    fontSize: 16,
    marginVertical: 5,
  },
});

export default landingPage;
