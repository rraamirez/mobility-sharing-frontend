import React, { useState } from "react";
import { View, TextInput, FlatList, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);

    if (text) {
      setResults([
        `Result for "${text}" 1`,
        `Result for "${text}" 2`,
        `Result for "${text}" 3`,
      ]);
    } else {
      setResults([]);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        placeholderTextColor="#aaa"
        value={query}
        onChangeText={handleSearch}
      />

      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Ionicons name="search-outline" size={20} color="#fff" />
            <Text style={styles.resultText}>{item}</Text>
          </View>
        )}
        contentContainerStyle={styles.resultsContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  searchInput: {
    height: 50,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    color: "#fff",
    marginBottom: 20,
    fontSize: 16,
  },
  resultsContainer: {
    paddingTop: 10,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  resultText: {
    color: "#fff",
    marginLeft: 10,
  },
});
