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
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const App: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [recognizedFood, setRecognizedFood] = useState<
    Array<{ name: string; confidence: number }>
  >([]);

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

  return (
    <SafeAreaView style={styles.container}>
      {hasPermission ? (
        <View style={{ alignItems: "center" }}>
          <Button
            title="Pick From Gallery"
            disabled={disableButton}
            onPress={pickImage}
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
                <Text key={index} style={styles.foodItem}>
                  {index + 1}. {item.name} (Confidence:{" "}
                  {(item.confidence * 100).toFixed(2)}%)
                </Text>
              ))}
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
});

