import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { PlaceCardProps } from "../models/PlaceCardModel";

const PlaceCard = ({
  name = "Unknown Place",
  description = "No description available",
  driver = "Unknown Driver",
  date = "Unknown Date",
  time = "Unknown Time",
  price = 0,
  latitude = 0,
  longitude = 0,
  enrolled = false,
}: PlaceCardProps) => {
  const [mapVisible, setMapVisible] = useState(false);

  const toggleMapVisibility = () => {
    setMapVisible((prevState) => !prevState);
  };

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.placeName}>{name}</Text>
      <Text style={styles.placeDescription}>{description}</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>🚗 Driver: {driver}</Text>
        <Text style={styles.detailText}>📅 Date: {date}</Text>
        <Text style={styles.detailText}>⏰ Time: {time}</Text>
        <Text style={styles.detailText}>💰 Price: {price} rupees</Text>
      </View>

      {mapVisible && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker coordinate={{ latitude, longitude }} title={name} />
          </MapView>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={toggleMapVisibility}
          style={[styles.button, styles.showMapButton]}
        >
          <Text style={styles.buttonText}>
            {mapVisible ? "Hide Map" : "Show Map"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            enrolled ? styles.cancelButton : styles.unenrollButton,
          ]}
          onPress={() => {
            alert("TODO ");
          }}
        >
          <Text style={styles.buttonText}>
            {enrolled ? "Unenroll" : "Cancel Travel"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "90%",
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  placeName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  placeDescription: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  detailsContainer: {
    alignItems: "flex-start",
    width: "100%",
    paddingLeft: 10,
    marginBottom: 12,
  },
  detailText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
  },
  mapContainer: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "48%",
  },
  unenrollButton: {
    backgroundColor: "#007bff",
  },
  cancelButton: {
    backgroundColor: "#d9534f",
  },
  showMapButton: {
    backgroundColor: "#444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleMapButton: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default PlaceCard;
