import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { FIREBASE_DB_CALENDAR } from "../firebaseConfig";
import { ref, set } from "firebase/database";
import { useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation";
import { RouteProp } from "@react-navigation/native";

// Define the type for the route params using RouteProp
type AddEventRouteProp = RouteProp<RootStackParamList, 'AddEvent'>;

const AddEventScreen: React.FC = () => {
  const [eventText, setEventText] = useState("");
  const { params } = useRoute<AddEventRouteProp>(); // Use the correct route type
  const { month, day } = params; // Access the month and day from route params

  const handleAddEvent = async () => {
    if (!eventText) {
      Alert.alert("Error", "Please enter an event description.");
      return;
    }

    const postRef = ref(FIREBASE_DB_CALENDAR, `calendar/${month}/${day}`);
    try {
      await set(postRef, {
        event: eventText,
      });
      Alert.alert("Success", "Event added to the calendar!");
      setEventText(""); // Reset input after adding
    } catch (error) {
      Alert.alert("Error", "Failed to add the event.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Event to Month {month}, Day {day}</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Description"
        value={eventText}
        onChangeText={setEventText}
      />
      <TouchableOpacity
        onPress={handleAddEvent}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1D4ED8", // Blue color
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#E5E7EB", // Gray color
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3B82F6", // Blue color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddEventScreen;
