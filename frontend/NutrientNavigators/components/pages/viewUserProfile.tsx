import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../app/index";

type ViewUserProfileProps = StackScreenProps<
  RootStackParamList,
  "ViewUserProfile"
>;

const ViewUserProfile: React.FC<ViewUserProfileProps> = ({
  navigation,
  route,
}) => {
  const { AccountInfo } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.info}>Name: {AccountInfo.name}</Text>
      <Text style={styles.info}>Age: {AccountInfo.age}</Text>
      <Text style={styles.info}>
        Biological Sex: {AccountInfo.biological_sex}
      </Text>
      <Text style={styles.info}>Height: {AccountInfo.height} cm</Text>
      <Text style={styles.info}>Weight: {AccountInfo.weight} kg</Text>
      <Text style={styles.info}>Goal: {AccountInfo.goal}</Text>

      <Button
        title="Edit Profile"
        onPress={() => navigation.navigate("EditUserProfile", { AccountInfo })}
      />
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
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ViewUserProfile;