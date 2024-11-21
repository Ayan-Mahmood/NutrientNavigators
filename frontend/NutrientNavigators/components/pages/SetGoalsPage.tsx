// SetGoalsPage.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../app/index";
const flask_api = "http://127.0.0.1:5000";

type SetGoalsProps = StackScreenProps<RootStackParamList, "SetGoalsPage">;

const SetGoalsPage: React.FC<SetGoalsProps> = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("Lose weight");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("Male");
  const [dietPreference, setDietPreference] = useState("");
  const [macroChoice, setMacroChoice] = useState("Standard");
  const [dailyMeals, setDailyMeals] = useState("");
  const [activityLevel, setActivityLevel] = useState("Very light");
  const [weeklyWorkouts, setWeeklyWorkouts] = useState("Very light");
  const [error, setError] = useState("");

  const AccountInfo = route.params.AccountInfo;

  useEffect(() => {
    if (!AccountInfo) {
      Alert.alert(
        "Unauthorized Access",
        "You must be logged in to access this page.",
        [{ text: "OK", onPress: () => navigation.replace("LoginPage") }]
      );
    }
  }, [AccountInfo, navigation]);

  const handleSubmit = async () => {
    console.log(AccountInfo);
    setError(""); // Clear previous error message
    try {
      const response = await axios.post(`${flask_api}/set_goals`, {
        user_id: AccountInfo.id,
        name: name,
        age: age,
        biological_sex: sex,
        height: height,
        weight: weight,
        goal: goal,
        preferred_diet: dietPreference,
        macro_choice: macroChoice,
        daily_meals: dailyMeals,
        activity_level: activityLevel,
        weekly_workouts: weeklyWorkouts,
      });

      if (response.data.success) {
        Alert.alert("Success", response.data.message);
        const { data } = await axios.get(`${flask_api}/get_user_profile`, {
          params: {
            user_id: AccountInfo.id,
          },
        });
        navigation.navigate("HomePage", { AccountInfo: data });
      } else {
        setError(response.data.error || "Failed to set goals.");
      }
    } catch (err) {
      if (err.response?.data?.error) {
        if (err.response?.data?.error.includes("Duplicate")) {
          //maybe make them go to edit profile page
          setError(
            "This User already has goals set. Please use the Edit Profile page to update goals."
          );
        } else {
          setError(err.response.data.error);
        }
      } else {
        setError("Unable to set goals. Please try again later.");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name (Please Enter your Full Name)</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter Name"
      />

      <Text style={styles.label}>Height (e.g., 5ft 10in or 180cm)</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={setHeight}
        placeholder="Enter height"
      />

      <Text style={styles.label}>Weight (e.g., 170lbs or 75kg)</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        placeholder="Enter weight"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Enter age"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Sex</Text>
      <Picker selectedValue={sex} onValueChange={setSex} style={styles.input}>
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker>

      <Text style={styles.label}>Goal</Text>
      <Picker selectedValue={goal} onValueChange={setGoal} style={styles.input}>
        <Picker.Item label="Lose weight" value="Lose weight" />
        <Picker.Item label="Build muscle" value="Build muscle" />
        <Picker.Item
          label="Athletic Performance"
          value="Athletic Performance"
        />
        <Picker.Item label="Body Recomposition" value="Body Recomposition" />
        <Picker.Item label="Improve Health" value="Improve Health" />
      </Picker>

      <Text style={styles.label}>Diet Preference</Text>
      <TextInput
        style={styles.input}
        value={dietPreference}
        onChangeText={setDietPreference}
        placeholder="Enter diet preference (e.g., Vegan)"
      />

      <Text style={styles.label}>Macro Choice</Text>
      <Picker
        selectedValue={macroChoice}
        onValueChange={setMacroChoice}
        style={styles.input}
      >
        <Picker.Item label="Standard" value="Standard" />
        <Picker.Item label="Custom" value="Custom" />
      </Picker>

      <Text style={styles.label}>Daily Meals</Text>
      <TextInput
        style={styles.input}
        value={dailyMeals}
        onChangeText={setDailyMeals}
        placeholder="Enter number of meals (1-8)"
      />

      <Text style={styles.label}>Activity Level</Text>
      <Picker
        selectedValue={activityLevel}
        onValueChange={setActivityLevel}
        style={styles.input}
      >
        <Picker.Item label="Very light" value="Very light" />
        <Picker.Item label="Light" value="Light" />
        <Picker.Item label="Moderate" value="Moderate" />
        <Picker.Item label="Heavy" value="Heavy" />
      </Picker>

      <Text style={styles.label}>Weekly Workouts</Text>
      <Picker
        selectedValue={weeklyWorkouts}
        onValueChange={setWeeklyWorkouts}
        style={styles.input}
      >
        <Picker.Item label="Very light" value="Very light" />
        <Picker.Item label="Light" value="Light" />
        <Picker.Item label="Moderate" value="Moderate" />
        <Picker.Item label="Intense" value="Intense" />
        <Picker.Item label="Very intense" value="Very intense" />
      </Picker>

      <Button title="Submit" onPress={handleSubmit} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default SetGoalsPage;
