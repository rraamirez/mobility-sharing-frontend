import React from "react";
import { Text, View } from "react-native";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type MapPreviewProps = {
  origin: Coordinate;
  destination?: Coordinate | null;
  style?: any;
  originTitle?: string;
  destinationTitle?: string;
  originDescription?: string;
  destinationDescription?: string;
  showTiles?: boolean;
};

const formatCoordinate = (coordinate: Coordinate) =>
  `${coordinate.latitude.toFixed(5)}, ${coordinate.longitude.toFixed(5)}`;

export default function MapPreview({
  origin,
  destination,
  style,
  originTitle = "Origin",
  destinationTitle = "Destination",
  originDescription,
  destinationDescription,
}: MapPreviewProps) {
  const src = destination
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(
        origin.longitude,
        destination.longitude
      ) - 0.02},${Math.min(origin.latitude, destination.latitude) - 0.02},${
        Math.max(origin.longitude, destination.longitude) + 0.02
      },${Math.max(origin.latitude, destination.latitude) + 0.02}&layer=mapnik&marker=${origin.latitude},${origin.longitude}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=${
        origin.longitude - 0.02
      },${origin.latitude - 0.02},${origin.longitude + 0.02},${
        origin.latitude + 0.02
      }&layer=mapnik&marker=${origin.latitude},${origin.longitude}`;

  return (
    <View style={[{ overflow: "hidden", backgroundColor: "#1f2937" }, style]}>
      {React.createElement("iframe", {
        src,
        title: destination
          ? `${originTitle} to ${destinationTitle}`
          : originTitle,
        style: {
          border: 0,
          height: "100%",
          width: "100%",
        },
        loading: "lazy",
      })}
      <View
        style={{
          position: "absolute",
          bottom: 8,
          left: 8,
          right: 8,
          backgroundColor: "rgba(0,0,0,0.68)",
          borderRadius: 6,
          padding: 8,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 12 }}>
          {originTitle}: {originDescription || formatCoordinate(origin)}
        </Text>
        {destination && (
          <Text style={{ color: "#fff", fontSize: 12 }}>
            {destinationTitle}:{" "}
            {destinationDescription || formatCoordinate(destination)}
          </Text>
        )}
      </View>
    </View>
  );
}
