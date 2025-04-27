import React, { useCallback, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
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

  const [selectedTravel, setSelectedTravel] = useState<TravelModel | null>(
    null
  );

  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

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
      console.error("Error while fetching user:", error);
    }
  };

  const handleSearch = async () => {
    if (!origin) return;
    setLoading(true);
    setError(null);
    try {
      const data = await travelService.getTravelsByOriginAndDestination(
        origin.trim(),
        destination.trim() || null
      );
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bookTravel = async (travelId: number, price: number) => {
    if (!user) return console.error("User not found.");
    if (price > user.rupeeWallet) {
      return alert("Insufficient funds in wallet. Please recharge.");
    }
    const data = await userTravelService.bookTravel(travelId, user.id);
    if (data) {
      alert(
        "Travel booked successfully! We will notify you when the driver decides."
      );
      router.replace("/trips");
    } else {
      console.error("Failed to book travel.");
    }
  };

  const bookAllTravels = async (group: TravelModel[]) => {
    const total = group.reduce((sum, t) => sum + t.price, 0);
    if (!user) return alert("User not found.");
    if (total > user.rupeeWallet) {
      return alert("Insufficient funds in wallet. Please recharge.");
    }
    try {
      for (const t of group) {
        await userTravelService.bookTravel(t.id, user.id);
      }
      alert("All travels booked successfully!");
      router.replace("/trips");
    } catch (err) {
      alert("Failed to book all travels.");
      console.error(err);
    }
  };

  const toggleGroup = (index: number) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
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
        keyExtractor={(_, i) => `group-${i}`}
        renderItem={({ item: group, index: groupIndex }) => (
          <View>
            {group.length > 1 ? (
              <>
                <TouchableOpacity
                  style={styles.groupHeaderContainer}
                  onPress={() => toggleGroup(groupIndex)}
                >
                  <Text style={styles.groupHeader}>
                    {`${group[0].origin} ➝ ${group[0].destination}`}
                  </Text>
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
                    keyExtractor={(t) => t.id.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.resultItem}>
                        <View style={styles.infoRow}>
                          <Ionicons name="car-outline" size={24} color="#fff" />
                          <View style={styles.resultInfo}>
                            <Text style={styles.resultText}>
                              {`${item.origin} ➝ ${item.destination}`}
                            </Text>
                            <Text style={styles.driverText}>
                              {`👤 ${item.driver.name}`}
                            </Text>
                            <Text style={styles.priceText}>
                              {`💰 ${item.price} Rupees`}
                            </Text>
                            <Text style={styles.dateText}>
                              {`📅 ${item.date} ⏰ ${item.time}`}
                            </Text>
                            <Text style={styles.recurrenceText}>
                              {`🔁 Recurring: ${
                                item.travelRecurrenceModel?.id ? "Yes" : "No"
                              }`}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.buttonRow}>
                          <TouchableOpacity
                            style={styles.bookButton}
                            onPress={() => bookTravel(item.id, item.price)}
                          >
                            <Text style={styles.bookButtonText}>Book Now</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.viewMapButton}
                            onPress={() => {
                              if (
                                item.latitudeOrigin &&
                                item.longitudeOrigin &&
                                item.latitudeDestination &&
                                item.longitudeDestination
                              ) {
                                setSelectedTravel(group[0]);
                              } else {
                                alert("Map coordinates are not available.");
                              }
                            }}
                          >
                            <Text style={styles.viewMapButtonText}>
                              View Map
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
                )}
              </>
            ) : (
              <View style={styles.resultItem}>
                <View style={styles.infoRow}>
                  <Ionicons name="car-outline" size={24} color="#fff" />
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultText}>
                      {`${group[0].origin} ➝ ${group[0].destination}`}
                    </Text>
                    <Text style={styles.driverText}>
                      {`👤 ${group[0].driver.name}`}
                    </Text>
                    <Text style={styles.priceText}>
                      {`💰 ${group[0].price} Rupees`}
                    </Text>
                    <Text style={styles.dateText}>
                      {`📅 ${group[0].date} ⏰ ${group[0].time}`}
                    </Text>
                    <Text style={styles.recurrenceText}>
                      {`🔁 Recurring: ${
                        group[0].travelRecurrenceModel?.id ? "Yes" : "No"
                      }`}
                    </Text>
                  </View>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => bookTravel(group[0].id, group[0].price)}
                  >
                    <Text style={styles.bookButtonText}>Book Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.viewMapButton}
                    onPress={() => {
                      if (
                        group[0].latitudeOrigin &&
                        group[0].longitudeOrigin &&
                        group[0].latitudeDestination &&
                        group[0].longitudeDestination
                      ) {
                        setSelectedTravel(group[0]);
                      } else {
                        alert("Map coordinates are not available.");
                      }
                    }}
                  >
                    <Text style={styles.viewMapButtonText}>View Map</Text>
                  </TouchableOpacity>
                </View>
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

      <Modal
        visible={selectedTravel !== null}
        animationType="slide"
        onRequestClose={() => setSelectedTravel(null)}
      >
        <View style={styles.modalContainer}>
          {selectedTravel && (
            <MapView
              style={styles.fullMap}
              initialRegion={{
                latitude: selectedTravel.latitudeOrigin!,
                longitude: selectedTravel.longitudeOrigin!,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
            >
              <Marker
                pinColor="blue"
                coordinate={{
                  latitude: selectedTravel.latitudeOrigin!,
                  longitude: selectedTravel.longitudeOrigin!,
                }}
                title="Origin"
              />
              <Marker
                coordinate={{
                  latitude: selectedTravel.latitudeDestination!,
                  longitude: selectedTravel.longitudeDestination!,
                }}
                title="Destination"
              />
            </MapView>
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedTravel(null)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  groupHeader: {
    color: "#0DBF6F",
    fontSize: 18,
    fontWeight: "bold",
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

  resultItem: {
    flexDirection: "column",
    backgroundColor: "#333",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
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

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  bookButton: {
    flex: 1,
    backgroundColor: "#0DBF6F",
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  viewMapButton: {
    flex: 1,
    backgroundColor: "#FFA500",
    paddingVertical: 8,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  viewMapButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullMap: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
