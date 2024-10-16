import React, { useEffect, useState } from "react";
import { registerRootComponent } from 'expo';
import { Text, View, ActivityIndicator } from "react-native";
import axios from "axios";

export default function Index() {
  const [message, setMessage] = useState(""); // State to store the message
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch the message from the Flask backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/getmessage") // Replace with your local IP
      .then((response) => {
        setMessage(response.data.message); // Set the message from the response
        setLoading(false); // Turn off loading state
      })
      .catch((error) => {
        console.error("Error fetching the message:", error);
        setLoading(false); // Turn off loading state even if there's an error
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Text>{message}</Text> // Display the fetched message
      )}
    </View>
  );
}

registerRootComponent(Index);
