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
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

interface FoodItem {
  name: string;
  confidence: number;
  isSelected: boolean;
}

const App: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [recognizedFood, setRecognizedFood] = useState<FoodItem[]>([]);
  const [foodInput, setFoodInput] = useState<string>(""); // Input for food item
  const [nutrition, setNutrition] = useState<{
    description: string;
    calories: string;
    protein: string;
    fat: string;
    carbohydrates: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Convert base64 to blob
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
        setRecognizedFood(
          responseJson.recognized_food.map((item: { name: string; confidence: number }) => ({
            ...item,
            isSelected: false,
          }))
        );
        Alert.alert("Success", "Image uploaded and processed successfully.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Error uploading image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handleSelectionChange = (index: number) => {
  //   setRecognizedFood((prev) =>
  //     prev.map((item, i) =>
  //       i === index ? { ...item, isSelected: !item.isSelected } : item
  //     )
  //   );
  // };
  const handleSelectionChange = async (index: number) => {
    const selectedItem = recognizedFood[index];
  
    // Toggle selection state
    const isSelected = !selectedItem.isSelected;
  
    // Clear previous selection and update current selection
    setRecognizedFood((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isSelected } : { ...item, isSelected: false }
      )
    );
  
    if (isSelected) {
      await fetchNutritionalData(selectedItem.name);
    } else {
      setNutrition(null); // Clear data if deselected
    }
  };
  
  let currentRequest = null;

  const fetchNutritionalData = async (foodName: string) => {
    try {
      setLoading(true);

      const request = `http://127.0.0.1:5000/get_nutritional_data?food_item=${encodeURIComponent(foodName)}`;
      currentRequest = request;

      const response = await fetch(request);
      const responseJson = await response.json();

      if (currentRequest === request) { // Only update state if this is the most recent request
        if (responseJson.error) {
          Alert.alert("Error", responseJson.error);
        } else {
          setNutrition(responseJson.food);
        }
      }
    } catch (error) {
      console.error("Error fetching nutritional data:", error);
      Alert.alert("Error", "Error fetching nutritional data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  const getNutritionalData = async () => {
    if (!foodInput) {
      Alert.alert("Error", "Please enter a food item.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:5000/get_nutritional_data?food_item=${foodInput}`);
      const responseJson = await response.json();

      if (responseJson.error) {
        Alert.alert("Error", responseJson.error);
      } else {
        setNutrition(responseJson.food);
      }
    } catch (error) {
      console.error("Error fetching nutritional data:", error);
      Alert.alert("Error", "Error fetching nutritional data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const selectedFood = recognizedFood.filter((item) => item.isSelected).map((item) => item.name);
    if (foodInput.trim()) {
      selectedFood.push(foodInput.trim());
    }

    if (selectedFood.length === 0) {
      Alert.alert("Error", "Please select or input at least one food item.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:5000/save_log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foodLog: selectedFood }),
      });

      if (response.ok) {
        Alert.alert("Success", "Food log saved successfully.");
        setFoodInput("");
        setRecognizedFood([]);
        setNutrition(null);
      } else {
        throw new Error("Failed to save log.");
      }
    } catch (error) {
      console.error("Error saving log:", error);
      Alert.alert("Error", "Failed to save the food log.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
              </View>
            )}
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {recognizedFood.length > 0 && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.title}>Recognized Food Items:</Text>
                {recognizedFood.map((item, index) => (
                  <View key={index} style={styles.foodItemContainer}>
                    <TouchableOpacity
                      style={styles.checkbox}
                      onPress={() => handleSelectionChange(index)}
                    >
                      <View
                        style={[
                          styles.checkboxInner,
                          item.isSelected && styles.checkboxChecked,
                        ]}
                      />
                    </TouchableOpacity>
                    <Text style={styles.foodItem}>
                      {index + 1}. {item.name} (Confidence: {(item.confidence * 100).toFixed(2)}%)
                    </Text>
                  </View>
                ))}
              </View>
            )}
            {nutrition && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.title}>Nutritional Information:</Text>
                <Text>Description: {nutrition.description}</Text>
                <Text>Calories: {nutrition.calories}</Text>
                <Text>Protein: {nutrition.protein}g</Text>
                <Text>Fat: {nutrition.fat}g</Text>
                <Text>Carbohydrates: {nutrition.carbohydrates}g</Text>
              </View>
            )}
            <TextInput
              style={styles.input}
              placeholder="Enter Override for nutritional data"
              value={foodInput}
              onChangeText={setFoodInput}
            />
            <Button title="Get Override Nutritional Data" onPress={getNutritionalData} />
            
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        ) : (
          <Text>Camera Roll Permission Required!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  foodItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  foodItem: {
    fontSize: 16,
    marginLeft: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    width: "80%",
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxInner: {
    width: 12,
    height: 12,
  },
  checkboxChecked: {
    backgroundColor: "#000",
  },
});
