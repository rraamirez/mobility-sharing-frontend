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
import MapView, { Marker } from "react-native-maps";

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

  // Coordinates:
  const [address, setAddress] = useState("");
  const [arrivalAddress, setArrivalAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [arrivalCoordinates, setArrivalCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCoordinates = async () => {
    if (!address || !arrivalAddress) {
      alert("Please enter both addresses");
      return;
    }

    setLoading(true);
    try {
      // Call to Nominatim API for the origin address

      console.log("Fetching coordinates for:", address, arrivalAddress);
      const responseOrigin = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`,
        {
          headers: {
            "User-Agent": "MyApp/1.0 (myemail@example.com)", // Your own User-Agent
          },
        }
      );

      // Call to Nominatim API for the arrival address
      const responseArrival = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          arrivalAddress
        )}`,
        {
          headers: {
            "User-Agent": "MyApp/1.0 (myemail@example.com)", // Your own User-Agent
          },
        }
      );

      const dataOrigin = await responseOrigin.json();
      const dataArrival = await responseArrival.json();

      if (dataOrigin.length > 0) {
        // Get the coordinates of the first result for the origin address
        const latOrigin = parseFloat(dataOrigin[0].lat);
        const lonOrigin = parseFloat(dataOrigin[0].lon);
        setCoordinates({ latitude: latOrigin, longitude: lonOrigin });
      } else {
        alert("Origin address not found.");
        setCoordinates(null);
      }

      if (dataArrival.length > 0) {
        // Get the coordinates of the first result for the arrival address
        const latArrival = parseFloat(dataArrival[0].lat);
        const lonArrival = parseFloat(dataArrival[0].lon);
        setArrivalCoordinates({ latitude: latArrival, longitude: lonArrival });
      } else {
        alert("Arrival address not found.");
        setArrivalCoordinates(null);
      }

      console.log("Origin coordinates:", coordinates);
      console.log("Arrival coordinates:", arrivalCoordinates);
    } catch (error) {
      alert("Error fetching coordinates");
    }
    setLoading(false);
  };

  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  const mapStyle = isFullScreen
    ? { flex: 1, width: "100%", height: "100%", borderRadius: 5 }
    : { flex: 1, marginTop: 20, width: "100%", borderRadius: 5 };

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
      latitudeOrigin: coordinates?.latitude ?? null,
      longitudeOrigin: coordinates?.longitude ?? null,
      latitudeDestination: arrivalCoordinates?.latitude ?? null,
      longitudeDestination: arrivalCoordinates?.longitude ?? null,
    }));

    if (isRecurring) {
      await travelService.createRecurrentTravel(payload);
    } else {
      await travelService.createTravel(payload[0]);
    }
    router.replace("/trips");
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

      <TextInput
        style={styles.input}
        placeholder="Example: Calle Cerro del Oro 60, Granada"
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        style={styles.input}
        placeholder="Example: Calle Cerro del Oro 60, Granada"
        value={arrivalAddress}
        onChangeText={setArrivalAddress}
      />

      <TouchableOpacity style={styles.button} onPress={fetchCoordinates}>
        <Text style={styles.buttonText}>Get Coordinates</Text>
      </TouchableOpacity>

      {/* Show a loading message while fetching coordinates */}
      {loading && <Text style={styles.loadingText}>Loading...</Text>}

      <TouchableOpacity onPress={toggleFullScreen} style={styles.button}>
        <Text style={styles.buttonText}>
          {isFullScreen ? "Exit Full Screen" : "View Full Screen Map"}
        </Text>
      </TouchableOpacity>

      {/* Show the map if coordinates are found */}
      {coordinates && (
        <MapView
          style={[
            styles.map, // Basic style
            isFullScreen
              ? { flex: 1, width: "100%", height: "100%" }
              : { height: 300 }, // Condition to change size
          ]}
          initialRegion={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          <Marker
            coordinate={coordinates}
            title="Location"
            description={address}
            pinColor="blue"
          />
          {arrivalCoordinates && (
            <Marker
              coordinate={arrivalCoordinates}
              title="Location"
              description={arrivalAddress}
            />
          )}
        </MapView>
      )}

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
  map: {
    flex: 1,
    marginTop: 20,
    width: "100%",
    borderRadius: 5,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "blue",
  },
});
