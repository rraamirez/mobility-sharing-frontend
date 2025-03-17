import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { PlaceCardProps } from "../models/PlaceCardModel";

const PlaceCard = ({
  name,
  description,
  latitude,
  longitude,
}: PlaceCardProps) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.placeName}>{name}</Text>
      <Text style={styles.placeDescription}>{description}</Text>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={{ latitude, longitude }} title={name} />
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "90%",
    marginBottom: 20,
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  placeName: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  placeDescription: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 10,
  },
  mapContainer: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
});

export default PlaceCard;
