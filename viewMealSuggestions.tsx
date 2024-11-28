import React, { useState } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../app/index";

type ViewMealSuggestionsProps = StackScreenProps<
  RootStackParamList,
  "ViewMealSuggestions"
>;

const ViewMealSuggestions: React.FC<ViewMealSuggestionsProps> = ({
  navigation,
  route,
}) => {
  const { AccountInfo } = route.params;
  const [loading, setLoading] = useState(false);
  const [mealSuggestions, setMealSuggestions] = useState<string[]>([]); // Change from string to string[]
  const [error, setError] = useState("");

  const generateMealSuggestions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`http://127.0.0.1:5000/suggest_meals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(AccountInfo.user_profile),
      });

      const data = await response.json();

      if (data.success) {
        setMealSuggestions(data.meals); // Set mealSuggestions as an array
      } else {
        setError("Failed to generate meal suggestions");
      }
    } catch (error) {
      setError("An error occurred while fetching meal suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="Generate Meal Suggestions"
        onPress={generateMealSuggestions}
      />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Meal Suggestions</Text>
          {mealSuggestions.length > 0 ? (
            mealSuggestions.map((meal, index) => (
              <Text key={index} style={styles.mealText}>
                • {meal}
              </Text>
            ))
          ) : (
            <Text style={styles.mealText}>No suggestions yet</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scrollView: {
    marginTop: 20,
  },
  mealText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default ViewMealSuggestions;
