import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { UserModel } from "../models/Users";
import userService from "../services/userService";
import ratingService from "../services/ratingService"; // Importa el servicio de ratings
import { RatingModel } from "../models/RatingModel";
import RatingCard from "../components/RatingCard";

export default function Ratings() {
  const [view, setView] = useState("toRate");
  const [user, setUser] = useState<UserModel | null>(null);
  //const [tripsToRate, setTripsToRate] = useState([]);
  const [ratedTrips, setRatedTrips] = useState<RatingModel[]>([]);
  const [receivedRatings, setReceivedRatings] = useState<RatingModel[]>([]);

  // Función para obtener el usuario y sus valoraciones
  const fetchUserData = async () => {
    try {
      const fetchedUser = await userService.getMyUser();
      setUser(fetchedUser);

      // // get travellsss
      // const trips = await ratingService.getRatingsByRatingUser(fetchedUser.id);
      // setTripsToRate(trips);

      const ratedTrips = await ratingService.getRatingsByRatingUser(
        fetchedUser.id
      );
      setRatedTrips(ratedTrips);

      // Cargar las valoraciones recibidas
      const receivedRatings = await ratingService.getRatingsByRatedUser(
        fetchedUser.id
      );
      setReceivedRatings(receivedRatings);

      console.log("Rated trips:", ratedTrips);
      console.log("Received ratings:", receivedRatings);
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };

  // Llamamos a la función cuando el componente se monta
  useEffect(() => {
    fetchUserData();
  }, []);

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
        {/* {view === "toRate" && (
          <FlatList
            data={tripsToRate}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.trip}</Text>
                <TouchableOpacity style={styles.rateButton}>
                  <Text style={styles.buttonText}>Rate Now</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )} */}

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

      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
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
});
