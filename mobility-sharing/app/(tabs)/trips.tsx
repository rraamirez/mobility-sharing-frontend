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
import { logout } from "../services/authService";
import PlaceCard from "../components/PlaceCard";
import { TravelModel } from "../models/TravelModel";
import userService from "../services/userService";
import { UserModel } from "../models/Users";
import travelService from "../services/travelService";

export default function Trips() {
  const router = useRouter();
  const [view, setView] = useState("driving");
  const [user, setUser] = useState<UserModel | null>(null);

  const [myTrips, setMyTrips] = useState<TravelModel[]>([]);
  const [enrolledTrips, setEnrolledTrips] = useState<TravelModel[]>([]);

  // Función para obtener los datos del usuario
  const fetchUserData = async () => {
    try {
      const fetchedUser = await userService.getMyUser();
      setUser(fetchedUser);
      console.log("Fetched user:", fetchedUser);

      // Obtener viajes del conductor
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

  const latitude = 48.8584;
  const longitude = 2.2945;

  const drivingTrips = [
    {
      name: "Eiffel Tower",
      description: "A famous iron tower located in Paris, France.",
      latitude: 48.8584,
      longitude: 2.2945,
    },
    {
      name: "Great Wall of China",
      description:
        "A series of fortifications in China, built to protect against invasions.",
      latitude: 40.4319,
      longitude: 116.5704,
    },
  ];

  const enrolledTripsData = [
    {
      name: "Machu Picchu",
      description:
        "An ancient Incan city located in the Andes mountains of Peru.",
      latitude: -13.1631,
      longitude: -72.545,
    },
  ];

  return (
    <View style={styles.container}>
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
        {(view === "driving" ? myTrips : enrolledTrips).map((place, index) => (
          <PlaceCard
            key={index}
            id={place.id}
            name={place.origin + " ➝ " + place.destination}
            description={place.time}
            latitude={latitude}
            longitude={longitude}
            driver={place.driver.name}
            date={place.date}
            time={place.time}
            price={place.price}
            enrolled={view === "enrolled"}
            status={place.status}
            fetchUserData={fetchUserData}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#000",
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
    backgroundColor: "#d9534f",
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
});
