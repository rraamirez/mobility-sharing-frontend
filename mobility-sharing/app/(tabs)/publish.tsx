import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
  Modal,
  ActivityIndicator,
  ScrollView,
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
  const [showMapModal, setShowMapModal] = useState(false);

  const fetchCoordinates = async () => {
    setCoordinates(null);
    setArrivalCoordinates(null);
    setShowMapModal(false);

    if (!address || !arrivalAddress) {
      alert("Please enter both addresses");
      return;
    }

    setLoading(true);
    try {
      const responseOrigin = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`,
        { headers: { "User-Agent": "MyApp/1.0 (myemail@example.com)" } }
      );
      const responseArrival = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          arrivalAddress
        )}`,
        { headers: { "User-Agent": "MyApp/1.0 (myemail@example.com)" } }
      );
      const dataOrigin = await responseOrigin.json();
      const dataArrival = await responseArrival.json();

      if (dataOrigin.length > 0) {
        const latOrigin = parseFloat(dataOrigin[0].lat);
        const lonOrigin = parseFloat(dataOrigin[0].lon);
        setCoordinates({ latitude: latOrigin, longitude: lonOrigin });
      } else alert("Origin address not found.");

      if (dataArrival.length > 0) {
        const latArrival = parseFloat(dataArrival[0].lat);
        const lonArrival = parseFloat(dataArrival[0].lon);
        setArrivalCoordinates({ latitude: latArrival, longitude: lonArrival });
      } else alert("Arrival address not found.");
    } catch (error) {
      alert("Error fetching coordinates");
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
      return () => {
        setOrigin("");
        setDestination("");
        setPrice("");
        setStartDate(null);
        setEndDate(null);
        setTime(null);
        setIsRecurring(false);
        setAddress("");
        setArrivalAddress("");
        setCoordinates(null);
        setArrivalCoordinates(null);
        setShowMapModal(false);
        setShowPicker(null);
      };
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

    const payload = dates.map((date) => {
      const trip: any = {
        driver: { id: user?.id ?? null },
        origin,
        destination,
        date,
        time,
        price: Number(price),
      };

      // include coordinates only if all four are available
      if (
        coordinates?.latitude != null &&
        coordinates?.longitude != null &&
        arrivalCoordinates?.latitude != null &&
        arrivalCoordinates?.longitude != null
      ) {
        trip.latitudeOrigin = coordinates.latitude;
        trip.longitudeOrigin = coordinates.longitude;
        trip.latitudeDestination = arrivalCoordinates.latitude;
        trip.longitudeDestination = arrivalCoordinates.longitude;
      }

      return trip;
    });

    if (isRecurring) await travelService.createRecurrentTravel(payload);
    else await travelService.createTravel(payload[0]);

    router.replace("/trips");
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.slogan}>Post a Trip</Text>

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

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.flex]}
          placeholder="Example: Calle Cerro del Oro 60, Granada"
          value={address}
          onChangeText={setAddress}
        />
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            setAddress("");
            setCoordinates(null);
          }}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.flex]}
          placeholder="Example: Calle Gran Capitan 5, Granada"
          value={arrivalAddress}
          onChangeText={setArrivalAddress}
        />
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            setArrivalAddress("");
            setArrivalCoordinates(null);
          }}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.mapButton} onPress={fetchCoordinates}>
          <Text style={styles.buttonText}>Get Coordinates</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => {
            if (!coordinates || !arrivalCoordinates) {
              alert("Please get coordinates first");
              return;
            }
            setShowMapModal(true);
          }}
        >
          <Text style={styles.mapButtonText}>Explore Fullscreen Map</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      )}

      {coordinates && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            <Marker
              coordinate={coordinates}
              title="Origin"
              description={address}
              pinColor="blue"
            />
            {arrivalCoordinates && (
              <Marker
                coordinate={arrivalCoordinates}
                title="Destination"
                description={arrivalAddress}
              />
            )}
          </MapView>
        </View>
      )}

      <Modal visible={showMapModal} animationType="slide">
        <View style={styles.modalContainer}>
          <MapView
            style={styles.modalMap}
            initialRegion={{
              latitude: coordinates?.latitude || 40.4168,
              longitude: coordinates?.longitude || -3.7038,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {coordinates && (
              <Marker coordinate={coordinates} title="Origin" pinColor="blue" />
            )}
            {arrivalCoordinates && (
              <Marker coordinate={arrivalCoordinates} title="Destination" />
            )}
          </MapView>
          <TouchableOpacity
            onPress={() => setShowMapModal(false)}
            style={styles.closeButton}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Switch
        value={isRecurring}
        onValueChange={setIsRecurring}
        trackColor={{ false: "gray", true: "gray" }}
        thumbColor={isRecurring ? "blue" : "white"}
        ios_backgroundColor="#555"
        style={{
          marginVertical: 10,
          transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
        }}
      />
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
            if (selectedTime)
              setTime(selectedTime.toTimeString().split(" ")[0]);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handlePublish}>
        <Text style={styles.buttonText}>Publish Trip</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: "#121212" },
  container: { padding: 20, alignItems: "center" },
  title: { fontSize: 24, color: "#fff", marginBottom: 20 },
  slogan: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
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
  inputText: { color: "#fff" },
  label: { color: "#fff", marginBottom: 10 },
  button: {
    backgroundColor: "#d9534f",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  flex: { flex: 1, marginBottom: 0 },
  resetButton: {
    backgroundColor: "#555",
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  resetButtonText: { color: "#fff" },
  mapControls: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mapButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  mapButtonText: { color: "#fff", fontSize: 16 },
  loader: { marginVertical: 10 },
  mapContainer: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 20,
  },
  map: { width: "100%", height: "100%" },
  modalContainer: { flex: 1 },
  modalMap: { flex: 1 },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
});
