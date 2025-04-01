import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect, useRouter } from "expo-router";
import userService from "../services/userService";
import { UserModel } from "../models/Users";
import travelService from "../services/travelService";

export default function Publish() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState<"start" | "end" | "time" | null>(
    null
  );
  const [isRecurring, setIsRecurring] = useState(false);
  const [user, setUser] = useState<UserModel | null>(null);

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  const fetchUser = async () => {
    try {
      const fetchedUser = await userService.getMyUser();
      setUser(fetchedUser);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const generateDateRange = (start: Date, end: Date) => {
    const result: string[] = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      result.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return result;
  };

  const handlePublish = async () => {
    if (
      !origin ||
      !destination ||
      !price ||
      !startDate ||
      (isRecurring && !endDate) ||
      !time
    ) {
      alert("Please fill in all fields");
      return;
    }

    const dates = isRecurring
      ? generateDateRange(startDate!, endDate!)
      : [startDate!.toISOString().split("T")[0]];

    const payload = dates.map((date) => ({
      driver: { id: user?.id ?? null },
      origin,
      destination,
      date,
      time,
      price: Number(price),
    }));

    if (isRecurring) {
      console.log("Creating recurrent travel with data:", payload);
      try {
        const response = await travelService.createRecurrentTravel(payload);
        if (response.status >= 200 && response.status < 300) {
          console.log("Recurrent travel response:", response.data);
          router.replace("/trips");
        } else {
          console.error(
            "Failed to create recurrent travel, status:",
            response.status,
            response.data
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            "Error while creating recurrent travel:",
            (error as any).response?.data || error.message
          );
        } else {
          console.error("Unexpected error:", error);
        }
      }
    } else {
      console.log("Creating travel with data:", payload[0]);
      try {
        const response = await travelService.createTravel(payload[0]);
        if (response.status >= 200 && response.status < 300) {
          router.replace("/trips");
        } else {
          console.error(
            "Failed to create travel, status:",
            response.status,
            response.data
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            "Error while creating travel:",
            (error as any).response?.data || error.message
          );
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post a Trip</Text>

      <TextInput
        style={styles.input}
        placeholder="Origin"
        placeholderTextColor="#bbb"
        value={origin}
        onChangeText={setOrigin}
      />

      <TextInput
        style={styles.input}
        placeholder="Destination"
        placeholderTextColor="#bbb"
        value={destination}
        onChangeText={setDestination}
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        placeholderTextColor="#bbb"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Switch value={isRecurring} onValueChange={setIsRecurring} />
      <Text style={styles.label}>
        {isRecurring ? "Recurring Trip" : "One-time Trip"}
      </Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker("start")}
      >
        <Text style={styles.inputText}>
          {startDate
            ? startDate.toISOString().split("T")[0]
            : "Select Start Date"}
        </Text>
      </TouchableOpacity>

      {isRecurring && (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPicker("end")}
        >
          <Text style={styles.inputText}>
            {endDate ? endDate.toISOString().split("T")[0] : "Select End Date"}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker("time")}
      >
        <Text style={styles.inputText}>{time || "Select Time"}</Text>
      </TouchableOpacity>

      {showPicker === "start" && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selectedDate) => {
            setShowPicker(null);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {showPicker === "end" && isRecurring && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selectedDate) => {
            setShowPicker(null);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}

      {showPicker === "time" && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selectedTime) => {
            setShowPicker(null);
            if (selectedTime) {
              const formattedTime = selectedTime.toTimeString().split(" ")[0];
              setTime(formattedTime);
            }
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handlePublish}>
        <Text style={styles.buttonText}>Publish Trip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#333",
    borderRadius: 5,
    color: "#fff",
  },
  inputText: {
    color: "#fff",
  },
  label: {
    color: "#fff",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#d9534f",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
