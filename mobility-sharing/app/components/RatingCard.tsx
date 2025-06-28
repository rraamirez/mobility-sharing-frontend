// RatingCard.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RatingModel } from "../models/RatingModel";

interface RatingCardProps {
  rating: RatingModel;
}

const RatingCard: React.FC<RatingCardProps> = ({ rating }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {rating.travel
          ? `${rating.travel.origin} ➡️ ${rating.travel.destination}`
          : "No Travel Info"}
      </Text>
      <Text style={styles.cardText}>Rating: {rating.rating}⭐</Text>
      <Text style={styles.cardText}>
        Comment: {rating.comment || "No comment"}
      </Text>
      <Text style={styles.cardText}>Rated by: {rating.ratingUser.name}</Text>
      <Text style={styles.cardText}>Received by: {rating.ratedUser.name}</Text>
      <Text style={styles.cardText}>Date: {formatDate(rating.createdAt)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
  cardText: { fontSize: 16, color: "#ccc", marginBottom: 5 },
});

export default RatingCard;
