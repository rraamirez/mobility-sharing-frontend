import React, { useCallback, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import travelService from "../services/travelService";
import { TravelModel } from "../models/TravelModel";
import { UserModel } from "../models/Users";
import userService from "../services/userService";
import userTravelService from "../services/userTravelService";
import { useFocusEffect } from "expo-router";

export default function Search() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [results, setResults] = useState<TravelModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserModel | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  const fetchUser = async () => {
    try {
      const fetchedUser = await userService.getMyUser();
      setUser(fetchedUser);
      console.log("Fetched user:", user);
    } catch (error) {
      console.error("Error while fetching user:", error);
    }
  };

  const handleSearch = async () => {
    if (!origin || !destination) return;

    setLoading(true);
    setError(null);

    try {
      const data = await travelService.getTravelsByOriginAndDestination(
        origin.trim(),
        destination.trim()
      );
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bookTravel = async (travelId: number): Promise<void> => {
    if (!user) {
      console.error("User not found. Cannot book travel.");
      return;
    }
    if (!travelId) {
      console.error("Travel ID is required to book travel.");
      return;
    }
    const data = await userTravelService.bookTravel(travelId, user!.id);
    console.log("Booking response:", data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.slogan}>It's your moment. Take the ride.</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Enter origin..."
        placeholderTextColor="#aaa"
        value={origin}
        onChangeText={setOrigin}
        onSubmitEditing={handleSearch}
      />

      <TextInput
        style={styles.searchInput}
        placeholder="Enter destination..."
        placeholderTextColor="#aaa"
        value={destination}
        onChangeText={setDestination}
        onSubmitEditing={handleSearch}
      />

      {loading && <ActivityIndicator size="large" color="#0DBF6F" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Ionicons name="car-outline" size={24} color="#fff" />
            <View style={styles.resultInfo}>
              <Text style={styles.resultText}>
                {`${item.origin} ➝ ${item.destination}`}
              </Text>
              <Text
                style={styles.driverText}
              >{`👤 Driver: ${item.driver.name}`}</Text>
              <Text style={styles.priceText}>{`💰 ${item.price} Rupees`}</Text>
              <Text
                style={styles.dateText}
              >{`📅 ${item.date} ⏰ ${item.time}`}</Text>
              <Text style={styles.recurrenceText}>
                {`🔁 Recurrent travel: ${
                  item.travelRecurrenceModel?.id ? "Yes" : "No"
                }`}
              </Text>
            </View>

            <View>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => bookTravel(item.id)}
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.resultsContainer}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.noResultsText}>No trips available</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  slogan: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  searchInput: {
    height: 50,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    color: "#fff",
    marginBottom: 15,
    fontSize: 16,
  },
  resultsContainer: {
    paddingTop: 10,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  resultInfo: {
    flex: 1,
    marginLeft: 10,
  },
  resultText: {
    color: "#fff",
    fontWeight: "bold",
  },
  driverText: {
    color: "#aaa",
  },
  priceText: {
    color: "#FFD700",
    fontWeight: "bold",
  },
  dateText: {
    color: "#0DBF6F",
  },
  recurrenceText: {
    color: "#FF6347",
  },
  bookButton: {
    backgroundColor: "#0DBF6F",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  noResultsText: {
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});
