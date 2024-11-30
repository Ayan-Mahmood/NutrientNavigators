import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, ToastAndroid } from "react-native";
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
  const  AccountInfo = route.params.AccountInfo;
  const [email, setEmail] = useState("");
  const [data, setData] = useState([]);

  const Item = ({ email }) => (
    <View style={styles.item}>      
      <Text style={styles.email}>{email}</Text>
    </View>
  );
  

  const renderItem = ({ item }) => (
    <Item email={item} />
  );

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
      const user_id = AccountInfo.user_profile.id;
      const response = await axios.get(`${flask_api}/get-list?user_id=${user_id}`);
      const responseData = response.data[1];      
      setData(responseData)
      
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

  const removeAccess = async (email) => {
    try{
      const user_id = AccountInfo.user_profile.id;
      const response = await axios.get(`${flask_api}/delete-user?user_id=${user_id}&email=${email}`);
      const responseData = response.data[1];      
      setData(responseData)
      
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

  useEffect(() => {
    // This code will run only once when the component mounts
    getList();
  }, []); // The empty dependency array ensures this effect only runs once


  return (
    
    <View style={styles.container}> 
     <View style={styles.subcontainer}>
     <Text style={styles.title}>Allowed Users</Text>
        <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              
            />
      </View>
      <View style={styles.subcontainer}>

        <Text style={styles.title}>Share Your Journal</Text>
      
        <TextInput
          style={styles.input}
          placeholder="example@email.com"
          value={email}
          onChangeText={setEmail}
        />

        <Button title="Save" onPress={handleSave} />
      </View>
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
  subcontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent:"flex-start",
  
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
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  email: {
    fontSize: 32,
  },
});

export default ShareUserProfile;
