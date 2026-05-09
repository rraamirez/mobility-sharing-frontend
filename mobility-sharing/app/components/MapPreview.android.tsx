import React from "react";
import MapView, { Marker, UrlTile } from "react-native-maps";

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

export default function MapPreview({
  origin,
  destination,
  style,
  originTitle = "Origin",
  destinationTitle = "Destination",
  originDescription,
  destinationDescription,
  showTiles = false,
}: MapPreviewProps) {
  return (
    <MapView
      style={style}
      initialRegion={{
        latitude: origin.latitude,
        longitude: origin.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
      {showTiles && (
        <UrlTile
          urlTemplate="https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />
      )}
      <Marker
        coordinate={origin}
        title={originTitle}
        description={originDescription}
        pinColor="blue"
      />
      {destination && (
        <Marker
          coordinate={destination}
          title={destinationTitle}
          description={destinationDescription}
        />
      )}
    </MapView>
  );
}
