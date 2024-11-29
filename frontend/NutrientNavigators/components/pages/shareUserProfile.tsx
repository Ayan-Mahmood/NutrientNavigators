import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../app/index";
import axios from "axios";
const flask_api = " https://nasty-crypt-xgr6rqp6r4v3xpr-5000.app.github.dev/";
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
  const [data, setData] = useState([]);


  const handleSave = async () => {
    try{
      const response = await axios.post(`${flask_api}/share_logs`, {
        email,
      });

      if(response.data.success){
        Alert.alert(
          "Allowed Access Updateded",
          "Your profile has been shared."
        );
      }
    }
    catch(error){
      if(error){
        Alert.alert(
          "Allowed Access Update Failed",
          "Your profile was not shared."
        );
      }
    }
   
    navigation.goBack();
  };

  const getList = async () => {
    try{
      const response = await axios.get(`${flask_api}/get-list`, {
        params: {
          user_id: AccountInfo.id,
        },
      });
      
      setData(response.data)
      
    }
    catch(error){
      if(error){
        console.log(error);
        Alert.alert(
          "Allowed Access Update Failed",
          "Your profile was not shared."
        );
      }
    }   
   
  };

  getList();

  return (


    
    <View style={styles.container}>
       <Button title="GetList" onPress={getList} />
      
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Text>{item.name}</Text>
        )}
        keyExtractor={(item) => item.id}
      />

      <Text style={styles.title}>Share Your Journal</Text>
    
      <TextInput
        style={styles.input}
        placeholder="example@email.com"
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
