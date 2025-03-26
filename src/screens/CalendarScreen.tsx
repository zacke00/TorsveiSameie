import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_DB_CALENDAR } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { RootStackParamList } from "../navigation";  // Make sure to import the RootStackParamList
import { StackNavigationProp } from "@react-navigation/stack"; // Import StackNavigationProp

const CalendarScreen: React.FC = () => {
  const [months, setMonths] = useState<number[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>(); // Updated to use StackNavigationProp

  // Fetch the calendar months from Firebase
  useEffect(() => {
    const calendarRef = ref(FIREBASE_DB_CALENDAR, "calendar/");
    onValue(calendarRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedMonths = Object.keys(data).map((key) => parseInt(key));
        setMonths(fetchedMonths);
      }
    });
  }, []);

  // Navigate to AddEvent screen
  const handleAddEvent = (month: number, day: number) => {
    navigation.navigate("AddEvent", { month, day });
  };

  // Render each month
  const renderMonth = ({ item }: { item: number }) => {
    return (
      <View style={styles.monthContainer}>
        <Text style={styles.monthTitle}>Month {item}</Text>
        <FlatList
          data={Array.from({ length: 31 }, (_, index) => index + 1)} // Days 1-31
          keyExtractor={(item) => item.toString()}
          renderItem={({ item: day }) => (
            <TouchableOpacity
              onPress={() => handleAddEvent(item, day)}
              style={styles.dayButton}
            >
              <Text style={styles.dayText}>Day {day}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Calendar</Text>
      <FlatList
        data={months}
        renderItem={renderMonth}
        keyExtractor={(item) => item.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#1D4ED8", // Blue color
    marginBottom: 20,
    textAlign: "center",
  },
  monthContainer: {
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: "500",
    color: "#4B5563", // Gray color
    marginBottom: 10,
  },
  dayButton: {
    backgroundColor: "#E0F2FE", // Light blue background
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  dayText: {
    fontSize: 18,
    color: "#1D4ED8", // Blue color
  },
});

export default CalendarScreen;
