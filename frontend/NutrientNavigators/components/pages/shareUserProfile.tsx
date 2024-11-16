import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../app/index";

type ShareUserProfileProps = StackScreenProps<
  RootStackParamList,
  "ShareUserProfile"
>;

const ShareUserProfile: React.FC<ShareUserProfileProps> = ({
  navigation,
  route,
}) => {
  const  AccountInfo = route.params;
  const [email, setEmail] = useState("");

  const handleSave = () => {
    // Implement save functionality here
    // For now, just show an alert and navigate back, however we need to make a patch request
    Alert.alert(
      "Allowed Access Updateded",
      "Your profile has been shared."
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Profile</Text>
    
      <TextInput
        style={styles.input}
        placeholder="Goal"
        value={email}
        onChangeText={setEmail}
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

export default ShareUserProfile;
