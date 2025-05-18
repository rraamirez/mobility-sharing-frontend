import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { PlaceCardProps } from "../models/PlaceCardModel";
import travelService from "../services/travelService";
import userTravelService from "../services/userTravelService";
import { useFocusEffect } from "@react-navigation/native";
import { UserTravelModel } from "../models/UserTravelModel";

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
  const [travellersVisible, setTravellersVisible] = useState(false);
  const [localUserTravelStatus, setLocalUserTravelStatus] =
    useState<string>(userTravelStatus);

  const [userTravellers, setUserTravellers] = useState<UserTravelModel[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchUserTravel();
      fetchUserTravelsByTravelId;
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

  const fetchUserTravelsByTravelId = async () => {
    if (id) {
      try {
        const response = await userTravelService.getUserTravelsByTravelId(id);
        setUserTravellers(response);
        setTravellersVisible((prevState) => !prevState);
      } catch (error) {
        console.error("Error fetching user travels:", error);
      }
    }
  };

  const simpleFetchUserTravelsByTravelId = async () => {
    if (id) {
      try {
        const response = await userTravelService.getUserTravelsByTravelId(id);
        setUserTravellers(response);
      } catch (error) {
        console.error("Error fetching user travels:", error);
      }
    }
  };

  const handleAcceptTraveller = (travelId: number, userId: number) => {
    userTravelService
      .acceptUserTravel(travelId, userId)
      .then(simpleFetchUserTravelsByTravelId)
      .catch((err) => Alert.alert("Error", err.message));
  };

  const handleRejectTraveller = (travelId: number, userId: number) => {
    userTravelService
      .cancelUserTravel(travelId, userId)
      .then(simpleFetchUserTravelsByTravelId)
      .catch((err) => Alert.alert("Error", err.message));
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
          <Text
            style={[
              localUserTravelStatus === "confirmed"
                ? { color: "#0DBF6F", fontWeight: "bold" }
                : localUserTravelStatus === "pending"
                ? { color: "#FFA500", fontWeight: "bold" }
                : localUserTravelStatus === "canceled"
                ? { color: "#FF0000", fontWeight: "bold" }
                : {},
            ]}
          >
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
      {!enrolled && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.fullButton]}
            onPress={fetchUserTravelsByTravelId}
          >
            <Text style={styles.buttonText}>Handle Travellers</Text>
          </TouchableOpacity>
        </View>
      )}
      {userTravellers.length > 0 && travellersVisible && (
        <View style={styles.travellersContainer}>
          {userTravellers.map((traveller, index) => (
            <View key={index} style={styles.travellerItem}>
              <View style={styles.travellerInfo}>
                <Text style={styles.detailText}>{traveller.user.username}</Text>
              </View>

              {traveller.status === "pending" && (
                <View style={styles.travellerActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() =>
                      id && handleAcceptTraveller(id, traveller.user.id)
                    }
                  >
                    <Text style={styles.buttonTextSmall}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() =>
                      id && handleRejectTraveller(id, traveller.user.id)
                    }
                  >
                    <Text style={styles.buttonTextSmall}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
              {traveller.status === "confirmed" && (
                <View style={styles.travellerActions}>
                  <Text style={styles.statusConfirmed}>Confirmed</Text>
                </View>
              )}
              {traveller.status === "canceled" && (
                <View style={styles.travellerActions}>
                  <Text style={styles.statusCanceled}>Canceled</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
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
  fullButton: {
    backgroundColor: "#444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  unenrollButton: {
    backgroundColor: "#007bff",
  },
  cancelButton: {
    backgroundColor: "#444",
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
  travellersContainer: {
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  travellerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  travellerName: {
    color: "#fff",
    fontSize: 14,
  },
  travellerStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  travellerActions: {
    flexDirection: "row",
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 6,
  },
  acceptButton: {
    backgroundColor: "#444",
  },
  rejectButton: {
    backgroundColor: "#FF8000",
  },
  statusConfirmed: {
    color: "#0DBF6F",
    fontWeight: "bold",
  },
  statusCanceled: {
    color: "#FF8000",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  buttonTextSmall: {
    color: "#fff",
    fontSize: 14,
  },
  travellerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default PlaceCard;
