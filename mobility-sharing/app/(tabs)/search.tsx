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
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import travelService from "../services/travelService";
import { TravelModel } from "../models/TravelModel";
import { UserModel } from "../models/Users";
import userService from "../services/userService";
import userTravelService from "../services/userTravelService";
import { useFocusEffect, useRouter } from "expo-router";

export default function Search() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [results, setResults] = useState<TravelModel[][]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserModel | null>(null);
  const router = useRouter();

  const [mapVisible, setMapVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  const toggleMapVisibility = () => {
    setMapVisible((prevState) => !prevState);
  };

  const fetchUser = async () => {
    try {
      const fetchedUser = await userService.getMyUser();
      setUser(fetchedUser);
      //console.log("Fetched user:", fetchUser);
    } catch (error) {
      console.error("Error while fetching user:", error);
    }
  };

  const handleSearch = async () => {
    console.log(user);
    if (!origin) return;

    setLoading(true);
    setError(null);

    try {
      const data = await travelService.getTravelsByOriginAndDestination(
        origin.trim(),
        destination.trim() || null
      );
      console.log("Search results:", data);
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bookTravel = async (travelId: number, price: number): Promise<void> => {
    console.log("Booking travel with ID:", travelId);
    if (!user) {
      console.error("User not found. Cannot book travel.");
      return;
    }
    if (!travelId) {
      console.error("Travel ID is required to book travel.");
      return;
    }

    if (price > user.rupeeWallet) {
      alert("Insufficient funds in wallet. Please recharge.");
      return;
    }

    const data = await userTravelService.bookTravel(travelId, user!.id);
    if (!data) {
      console.error("Failed to book travel.");
      return;
    } else {
      alert(
        "Travel booked successfully! We will noitify you when the driver takes the final decision."
      );
      router.replace("/trips");
    }
  };

  const bookAllTravels = async (group: TravelModel[]) => {
    let finalPrice = 0;
    let userWallet = user?.rupeeWallet || 0;
    group.forEach((travel) => {
      finalPrice += travel.price;
    });

    if (finalPrice > userWallet) {
      alert("Insufficient funds in wallet. Please recharge.");
      return;
    }

    if (!user) {
      alert("User not found. Please log in.");
      return;
    }
    if (group.length === 0) {
      alert("No travels to book.");
      return;
    }
    try {
      // await Promise.all( //problems with transactions in the backend
      //   group.map((travel) => userTravelService.bookTravel(travel.id, user.id))
      // );

      for (const travel of group) {
        await userTravelService.bookTravel(travel.id, user.id);
      }

      alert("All travels booked successfully!");
      router.replace("/trips");
    } catch (error) {
      alert("Failed to book all travels.");
      console.error("Booking error:", error);
    }
  };

  const [expandedGroups, setExpandedGroups] = useState(new Set<number>());

  const toggleGroup = (index: number) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
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
        keyExtractor={(_, index) => `group-${index}`}
        renderItem={({ item: group, index: groupIndex }) => (
          <View>
            {group.length > 1 ? (
              <>
                <TouchableOpacity
                  style={styles.groupHeaderContainer}
                  onPress={() => toggleGroup(groupIndex)}
                >
                  <Text
                    style={styles.groupHeader}
                  >{`${group[0].origin} ➝ ${group[0].destination}`}</Text>
                  <TouchableOpacity
                    style={styles.bookAllButton}
                    onPress={() => bookAllTravels(group)}
                  >
                    <Text style={styles.bookAllButtonText}>Book All</Text>
                  </TouchableOpacity>
                </TouchableOpacity>

                {expandedGroups.has(groupIndex) && (
                  <FlatList
                    data={group}
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
                          <Text
                            style={styles.priceText}
                          >{`💰 ${item.price} Rupees`}</Text>
                          <Text
                            style={styles.dateText}
                          >{`📅 ${item.date} ⏰ ${item.time}`}</Text>
                          <Text style={styles.recurrenceText}>
                            {`🔁 Recurrent travel: ${
                              item.travelRecurrenceModel?.id ? "Yes" : "No"
                            }`}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.bookButton}
                          onPress={() => bookTravel(item.id, item.price)}
                        >
                          <Text style={styles.bookButtonText}>Book Now</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                )}
              </>
            ) : (
              <View style={styles.resultItem}>
                <Ionicons name="car-outline" size={24} color="#fff" />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultText}>
                    {`${group[0].origin} ➝ ${group[0].destination}`}
                  </Text>
                  <Text
                    style={styles.driverText}
                  >{`👤 Driver: ${group[0].driver.name}`}</Text>
                  <Text
                    style={styles.priceText}
                  >{`💰 ${group[0].price} Rupees`}</Text>
                  <Text
                    style={styles.dateText}
                  >{`📅 ${group[0].date} ⏰ ${group[0].time}`}</Text>
                  <Text style={styles.recurrenceText}>
                    {`🔁 Recurrent travel: ${
                      group[0].travelRecurrenceModel?.id ? "Yes" : "No"
                    }`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => bookTravel(group[0].id, group[0].price)}
                >
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
                <View style={{ height: 10 }} />
              </View>
            )}
          </View>
        )}
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
  groupHeader: {
    color: "#0DBF6F",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    paddingBottom: 4,
  },
  groupHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#222",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 5,
  },

  bookAllButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  bookAllButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
