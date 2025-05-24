// En el componente Trips

import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import PlaceCard from "../components/PlaceCard";
import { TravelModel } from "../models/TravelModel";
import userService from "../services/userService";
import { UserModel } from "../models/Users";
import travelService from "../services/travelService";
import { Ionicons } from "@expo/vector-icons";

export default function Trips() {
  const router = useRouter();
  const [view, setView] = useState("driving");
  const [user, setUser] = useState<UserModel | null>(null);

  const [myTrips, setMyTrips] = useState<TravelModel[]>([]);
  const [enrolledTrips, setEnrolledTrips] = useState<TravelModel[]>([]);

  const fetchUserData = async () => {
    try {
      const fetchedUser = await userService.getMyUser();
      setUser(fetchedUser);
      console.log("Fetched user:", fetchedUser);

      const trips = await travelService.getTravelsByDriver(fetchedUser.id);
      setMyTrips(trips);

      const enrolledTrips = await travelService.getEnrolledTravelsByUser(
        fetchedUser.id
      );
      setEnrolledTrips(enrolledTrips);

      console.log("My trips:", trips);
      console.log("Enrolled trips:", enrolledTrips);
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Trips</Text>

      <Text style={styles.motto}>
        "Shared journeys, better tomorrows. Every ride connects a story."
      </Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, view === "driving" && styles.activeTab]}
          onPress={() => setView("driving")}
        >
          <Text style={styles.tabText}>Driving</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, view === "enrolled" && styles.activeTab]}
          onPress={() => setView("enrolled")}
        >
          <Text style={styles.tabText}>Enrolled</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.placesList}>
        {(() => {
          const trips = view === "driving" ? myTrips : enrolledTrips;

          if (trips.length === 0) {
            return (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name={
                    view === "driving" ? "car-sport-outline" : "people-outline"
                  }
                  size={200}
                  color="#888"
                />
                <Text style={styles.emptyText}>
                  {view === "driving"
                    ? "No driving trips yet"
                    : "No enrolled trips yet"}
                </Text>
              </View>
            );
          }

          return trips.map((place, index) => (
            <PlaceCard
              key={index}
              id={place.id}
              name={place.origin + " ➝ " + place.destination}
              description={place.time}
              latitudeOrigin={place.latitudeOrigin}
              longitudeOrigin={place.longitudeOrigin}
              latitudeDestination={place.latitudeDestination}
              longitudeDestination={place.longitudeDestination}
              driver={place.driver.name}
              driverRating={place.driver.rating ?? 3}
              driverEcoRankName={place.driver.ecoRank.name}
              environmentalAction={place.environmentalActionLevel ?? "LOW"}
              date={place.date}
              time={place.time}
              price={place.price}
              enrolled={view === "enrolled"}
              status={place.status}
              userId={user?.id}
              fetchUserData={fetchUserData}
            />
          ));
        })()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#121212",
    paddingTop: 20,
  },
  motto: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
    justifyContent: "center",
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#444",
    marginHorizontal: 10,
  },
  activeTab: {
    backgroundColor: "#FF8000",
  },
  tabText: {
    color: "#fff",
    fontSize: 14,
  },
  placesList: {
    width: "100%",
    paddingHorizontal: 20,
    marginLeft: 25,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginRight: 20,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
});
