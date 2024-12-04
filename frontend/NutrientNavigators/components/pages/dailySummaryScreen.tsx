import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../app/index";

type DailySummaryScreenProps = StackScreenProps<
  RootStackParamList,
  "DailySummaryScreen"
>;

const DailySummaryScreen: React.FC<DailySummaryScreenProps> = ({
  route,
  navigation,
}) => {
  const { AccountInfo } = route.params;

  const [dailySummary, setDailySummary] = useState<{
    meals: { name: string; calories: number; protein: number; carbs: number; fat: number }[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    goalCalories?: number;
    goalProtein?: number;
    goalCarbs?: number;
    goalFats?: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!AccountInfo) {
      Alert.alert(
        "Unauthorized Access",
        "You must be logged in to access this page.",
        [{ text: "OK", onPress: () => navigation.replace("LoginPage") }]
      );
      return;
    }
    fetchDailySummary();
  }, [AccountInfo]);

  const fetchDailySummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:5000/daily_summary`, {
        params: { user_id: AccountInfo.user_profile.id, date: new Date().toISOString().split("T")[0] },
      });
      if (response.data.success) {
        setDailySummary(response.data.summary);
      } else {
        setError("Failed to fetch daily summary.");
      }
    } catch (err) {
      setError("An error occurred while fetching daily summary.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!dailySummary) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No summary available for today.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Today's Meals</Text>
      {dailySummary.meals.map((meal, index) => (
        <View key={index} style={styles.mealItem}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text>Calories: {meal.calories}</Text>
          <Text>Protein: {meal.protein}g</Text>
          <Text>Carbs: {meal.carbs}g</Text>
          <Text>Fat: {meal.fat}g</Text>
        </View>
      ))}

      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text>Total Calories: {dailySummary.totalCalories}</Text>
        <Text>Protein: {dailySummary.totalProtein}g</Text>
        <Text>Carbs: {dailySummary.totalCarbs}g</Text>
        <Text>Fat: {dailySummary.totalFat}g</Text>
        {dailySummary.goalCalories && (
          <Text>Calorie Goal: {dailySummary.goalCalories}</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mealItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  mealName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  summarySection: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default DailySummaryScreen;
