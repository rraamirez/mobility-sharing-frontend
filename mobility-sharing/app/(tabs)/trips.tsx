import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { logout } from "../services/authService";
import PlaceCard from "../components/PlaceCard";

export default function Trips() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const places = [
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
      <Text style={styles.title}>Welcome to Trips</Text>

      <ScrollView style={styles.placesList}>
        {places.map((place, index) => (
          <PlaceCard
            key={index}
            name={place.name}
            description={place.description}
            latitude={place.latitude}
            longitude={place.longitude}
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#fff",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#d9534f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  placesList: {
    width: "100%",
    paddingHorizontal: 20,
  },
});
