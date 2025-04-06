import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";
import { UserModel } from "../models/Users";
import userService from "../services/userService";
import ratingService from "../services/ratingService";
import travelService from "../services/travelService";
import { RatingModel } from "../models/RatingModel";
import RatingCard from "../components/RatingCard";
import { TravelModel } from "../models/TravelModel";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Ratings() {
  const [view, setView] = useState("toRate");
  const [user, setUser] = useState<UserModel | null>(null);
  const [tripsToRate, setTripsToRate] = useState<TravelModel[]>([]);
  const [ratedTrips, setRatedTrips] = useState<RatingModel[]>([]);
  const [receivedRatings, setReceivedRatings] = useState<RatingModel[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TravelModel | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchUserData = async () => {
    try {
      const fetchedUser = await userService.getMyUser();
      setUser(fetchedUser);
      console.log("Fetched user:", fetchedUser);

      // // get travellsss
      const trips = await travelService.getUnratedTrips(fetchedUser.id);
      setTripsToRate(trips);

      const ratedTrips = await ratingService.getRatingsByRatingUser(
        fetchedUser.id
      );
      setRatedTrips(ratedTrips);

      const receivedRatings = await ratingService.getRatingsByRatedUser(
        fetchedUser.id
      );
      setReceivedRatings(receivedRatings);

      console.log("trips to rate:", tripsToRate);

      // console.log("Rated trips:", ratedTrips);
      // console.log("Received ratings:", receivedRatings);
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const openRatingModal = (trip: TravelModel) => {
    setSelectedTrip(trip);
    setModalVisible(true);

    //console.log("Selected trip:", trip);
  };

  const submitRating = async () => {
    if (!selectedTrip) return;
    console.log("Submitting rating:", {
      rating,
      comment,
      tripId: selectedTrip.id,
    });
    let newRating: RatingModel = {
      id: 0,
      ratingUser: user!,
      ratedUser: selectedTrip.driver,
      travel: selectedTrip,
      rating,
      comment,
      createdAt: null!,
    };
    console.log("New rating:", newRating);
    try {
      await ratingService.createRating(newRating);
      setModalVisible(false);
      setComment("");
      fetchUserData();
    } catch (error) {
      console.error("Error while submitting rating:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ratings</Text>
      <Text style={styles.subtitle}>
        "Shaping journeys, building trust – rate, connect, evolve."
      </Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, view === "toRate" && styles.activeTab]}
          onPress={() => setView("toRate")}
        >
          <Text style={styles.tabText}>Trips to Rate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, view === "rated" && styles.activeTab]}
          onPress={() => setView("rated")}
        >
          <Text style={styles.tabText}>Rated Trips</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, view === "received" && styles.activeTab]}
          onPress={() => setView("received")}
        >
          <Text style={styles.tabText}>My Received Ratings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {view === "toRate" && (
          <FlatList
            data={tripsToRate}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text
                  style={styles.cardTitle}
                >{`${item.origin} ➡️ ${item.destination}`}</Text>
                <Text
                  style={styles.cardText}
                >{`Driver: ${item.driver.name}`}</Text>
                <Text style={styles.cardText}>{`Date: ${item.date}`}</Text>
                <Text style={styles.cardText}>{`Time: ${item.time}`}</Text>
                <Text
                  style={styles.cardText}
                >{`Date: ${item.driver.name}`}</Text>
                <Text style={styles.cardText}>{`Status: ${item.status}`}</Text>
                <TouchableOpacity
                  style={styles.rateButton}
                  onPress={() => openRatingModal(item)}
                >
                  <Text style={styles.buttonText}>Rate Now</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        {view === "rated" && (
          <FlatList
            data={ratedTrips}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <RatingCard rating={item} />}
          />
        )}

        {view === "received" && (
          <FlatList
            data={receivedRatings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <RatingCard rating={item} />}
          />
        )}
      </View>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Rate this trip</Text>
          <View style={{ flexDirection: "row", marginVertical: 10 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Icon
                  name={star <= rating ? "star" : "star-o"}
                  size={30}
                  color="gold"
                  style={{ marginHorizontal: 5 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Leave a comment..."
            placeholderTextColor="#aaa"
            onChangeText={setComment}
            value={comment}
          />
          <TouchableOpacity style={styles.submitButton} onPress={submitRating}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#aaa", marginBottom: 20 },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-evenly",
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#444",
  },
  activeTab: { backgroundColor: "#d9534f" },
  tabText: { color: "#fff", fontSize: 14 },
  content: { flex: 1, width: "100%" },
  card: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  cardText: { fontSize: 16, color: "#ccc" },
  rateButton: {
    backgroundColor: "#f0ad4e",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  backButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  modalContainer: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: "#f0ad4e",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});
