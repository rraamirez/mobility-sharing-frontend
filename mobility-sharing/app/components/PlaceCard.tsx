import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { PlaceCardProps } from "../models/PlaceCardModel";
import travelService from "../services/travelService";
import userTravelService from "../services/userTravelService";
import { useFocusEffect } from "@react-navigation/native";

const PlaceCard = ({
  id,
  name = "Unknown Place",
  description = "No description available",
  driver = "Unknown Driver",
  date = "Unknown Date",
  time = "Unknown Time",
  price = 0,
  latitudeOrigin = 0,
  longitudeOrigin = 0,
  latitudeDestination = 0,
  longitudeDestination = 0,
  enrolled = false,
  status = "ACTIVE",
  userId = 0,
  userTravelStatus = "pending",
  fetchUserData,
}: PlaceCardProps) => {
  const [mapVisible, setMapVisible] = useState(false);
  const [localUserTravelStatus, setLocalUserTravelStatus] =
    useState<string>(userTravelStatus);

  useFocusEffect(
    useCallback(() => {
      fetchUserTravel();
    }, [enrolled, id, userId])
  );

  const toggleMapVisibility = () => {
    setMapVisible((prevState) => !prevState);
  };

  const handleCancel = async (travelId: number) => {
    travelService
      .cancelTravel(travelId)
      .then((response) => {
        Alert.alert("Success", "Travel has been canceled.");
        if (fetchUserData) fetchUserData();
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const handleUnenroll = async (travelId: number, userId: number) => {
    console.log("Unenrolling from travel:", travelId, userId);
    await userTravelService
      .cancelUserTravel(travelId, userId)
      .then((response) => {
        console.log("Unenroll response:", response);
        Alert.alert(
          "Success",
          "You have successfully unenrolled from the travel."
        );
        if (fetchUserData) fetchUserData();
      });
  };

  const fetchUserTravel = async () => {
    if (enrolled && id && userId) {
      try {
        const response =
          await userTravelService.getUserTravelByUserIdAndTravelId(userId, id);
        setLocalUserTravelStatus(response.status);
      } catch (error) {
        console.error("Error fetching user travel:", error);
      }
    }
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
        <Text style={styles.detailText}>Status : {status}</Text>
        {enrolled && (
          <Text style={styles.detailText}>
            Confirmation: {localUserTravelStatus}
          </Text>
        )}
      </View>

      {mapVisible && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: latitudeOrigin,
              longitude: longitudeOrigin,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={{
                latitude: latitudeOrigin,
                longitude: longitudeOrigin,
              }}
              title={name}
              pinColor="blue"
            />
            <Marker
              coordinate={{
                latitude: latitudeDestination,
                longitude: longitudeDestination,
              }}
              title={name}
            />
          </MapView>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={toggleMapVisibility}
          style={[styles.button, styles.showMapButton]}
          disabled={
            latitudeOrigin === 0 ||
            longitudeOrigin === 0 ||
            latitudeDestination === 0 ||
            longitudeDestination === 0 ||
            latitudeOrigin === null ||
            longitudeOrigin === null ||
            latitudeDestination === null ||
            longitudeDestination === null
          }
        >
          <Text style={styles.buttonText}>
            {latitudeOrigin === 0 ||
            longitudeOrigin === 0 ||
            latitudeDestination === 0 ||
            longitudeDestination === 0 ||
            latitudeOrigin === null ||
            longitudeOrigin === null ||
            latitudeDestination === null ||
            longitudeDestination === null
              ? "Map Disabled"
              : mapVisible
              ? "Hide Map"
              : "Show Map"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            status === "CANCELED"
              ? styles.showMapButton
              : enrolled
              ? styles.cancelButton
              : styles.unenrollButton,
          ]}
          onPress={() => {
            if (status === "CANCELED") {
              Alert.alert("Info", "This travel has been canceled.");
            } else if (!enrolled) {
              if (id !== undefined) {
                handleCancel(id);
              } else {
                Alert.alert("Error", "Travel ID is undefined.");
              }
            } else {
              handleUnenroll(id!, userId!);
            }
          }}
        >
          <Text style={styles.buttonText}>
            {status === "CANCELED"
              ? "Cancelled"
              : enrolled
              ? "Unenroll"
              : "Cancel Travel"}
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
