import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import travelService from "../services/travelService";
import { TravelModel } from "../models/TravelModel";

export default function Search() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [results, setResults] = useState<TravelModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!origin || !destination) return;

    setLoading(true);
    setError(null);

    try {
      const data = await travelService.getTravelsByOriginAndDestination(
        origin.trim(),
        destination.trim()
      );
      console.log("Search results:", data); // Debugging line
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.slogan}>Its your moment. Take the ride </Text>

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
            <Ionicons name="car-outline" size={20} color="#fff" />
            <View style={styles.resultInfo}>
              <Text
                style={styles.resultText}
              >{`${item.origin} ➝ ${item.destination}`}</Text>
              <Text
                style={styles.driverText}
              >{`👤 Driver: ${item.driver.name}`}</Text>
              <Text
                style={styles.priceText}
              >{`💰 Price: ${item.price} Rupees `}</Text>
              <Text
                style={styles.dateText}
              >{`📅 ${item.date} ⏰ ${item.time}`}</Text>
              <Text style={styles.driverText}>{`🔁 Recurrent travel: ${
                item.travelRecurrenceModel?.id ? "Yes :)" : "No :("
              }`}</Text>
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
    fontSize: 18,
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
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  resultInfo: {
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
