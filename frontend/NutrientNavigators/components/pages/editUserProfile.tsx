import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../app/index";

type EditUserProfileProps = StackScreenProps<
  RootStackParamList,
  "EditUserProfile"
>;

const EditUserProfile: React.FC<EditUserProfileProps> = ({
  navigation,
  route,
}) => {
  const { AccountInfo } = route.params;

  const [name, setName] = useState(AccountInfo.user_profile.name);
  const [age, setAge] = useState(AccountInfo.user_profile.age);
  const [biologicalSex, setBiologicalSex] = useState(
    AccountInfo.user_profile.biological_sex
  );
  const [height, setHeight] = useState(AccountInfo.user_profile.height);
  const [weight, setWeight] = useState(AccountInfo.user_profile.weight);
  const [goal, setGoal] = useState(AccountInfo.user_profile.goal);

  const handleSave = () => {
    // Implement save functionality here
    // For now, just show an alert and navigate back, however we need to make a patch request
    Alert.alert(
      "Profile Updated",
      "Your profile has been updated successfully."
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={String(age)}
        onChangeText={(value) => setAge(Number(value))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Biological Sex"
        value={biologicalSex}
        onChangeText={setBiologicalSex}
      />
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        value={String(height)}
        onChangeText={(value) => setHeight(Number(value))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={String(weight)}
        onChangeText={(value) => setWeight(Number(value))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Goal"
        value={goal}
        onChangeText={setGoal}
      />

      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: "80%",
  },
});

export default EditUserProfile;
