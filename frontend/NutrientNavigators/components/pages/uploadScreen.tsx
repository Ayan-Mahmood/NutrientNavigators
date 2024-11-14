import React, { useState, useEffect } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Alert,
  Text,
  Image,
  View,
  ActivityIndicator,
  Platform,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Checkbox from '@react-native-community/checkbox';
import axios from 'axios';

const flask_api = "http://127.0.0.1:5000";

const App: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [recognizedFood, setRecognizedFood] = useState<
    Array<{ name: string; confidence: number }>
  >([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [customFood, setCustomFood] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // convert the base64 string to blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  };

  const pickImage = async () => {
    setDisableButton(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (result.canceled) {
      setDisableButton(false);
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageUri(asset.uri);

      if (asset.base64) {
        const blob = base64ToBlob(asset.base64, asset.type || "image/jpeg");
        setDisableButton(false);
        await uploadPhoto(blob);
      } else {
        Alert.alert("Error", "Failed to retrieve image data.");
      }
    } else {
      Alert.alert("No image selected", "Please select an image.");
      setDisableButton(false);
    }
  };

  const takePhoto = async() => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageUri(asset.uri);  
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      await uploadPhoto(blob);  
    }
  };

  const uploadPhoto = async (imageBlob: Blob) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", imageBlob, "photo.jpg");

    try {
      const response = await fetch("http://127.0.0.1:5000/recognize_food", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const responseJson = await response.json();
      if (responseJson.error) {
        Alert.alert("Error", responseJson.error);
      } else {
        setRecognizedFood(responseJson.recognized_food);
        Alert.alert("Success", "Image uploaded and processed successfully.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Error uploading image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFood = (food: string) => {
    if (selectedFoods.includes(food)) {
      setSelectedFoods(selectedFoods.filter(item => item !== food));
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  const handleSubmit = async() => {
    const logData = customFood ? [...selectedFoods, customFood] : selectedFoods;

    if (logData.length === 0) {
      Alert.alert("Error", "Please select or enter at least one food item.");
      return;
    }

    try {
      await axios.post(`{flask_api}/log_food`, { foods: logData });
      Alert.alert("Succes", "Food log saved successfully!");
      setSelectedFoods([]);
      setCustomFood("");
    } catch (error) {
      console.error("Error saving food log:", error);
      Alert.alert("Error", "Failed to save the food log.");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {hasPermission ? (
        <View style={{ alignItems: "center" }}>
          <Button
            title="Pick From Gallery"
            disabled={disableButton}
            onPress={pickImage}
          />
          <Button
            title="Take a Photo"
            onPress={takePhoto}
          />
          {imageUri && (
            <View>
              <Image
                source={{ uri: imageUri }}
                style={{ width: 200, height: 200, marginVertical: 10 }}
              />
              {/* <Button title="Upload Image" onPress={() => uploadPhoto} /> */}
            </View>
          )}
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          {recognizedFood.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.title}>Recognized Food Items:</Text>
              {recognizedFood.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                  <Checkbox
                    value={selectedFoods.includes(item.name)}
                    onValueChange={() => handleSelectFood(item.name)}
                  />
                  <Text style={styles.foodItem}>
                    {index + 1}. {item.name} (Confidence: {(item.confidence * 100).toFixed(2)}%)
                  </Text>
                </View>
              ))}
              <TextInput
                style={styles.input}
                placeholder="Enter custom food"
                value={customFood}
                onChangeText={setCustomFood}
              />
              <Button title="Submit Food Log" onPress={handleSubmit} />
            </View>
          )}
        </View>
      ) : (
        <Text>Camera Roll Permission Required!</Text>
      )}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  foodItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    width: "100%",
    marginVertical: 10,
  },
});

