import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Publish() {
    const [tripTitle, setTripTitle] = useState("");
    const [tripDescription, setTripDescription] = useState("");
    const [tripDate, setTripDate] = useState("");
    const router = useRouter();

    const handlePublish = () => {
        console.log("Trip Published:", { tripTitle, tripDescription, tripDate });
        router.replace("/trips");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Post a Trip</Text>

            <TextInput
                style={styles.input}
                placeholder="Trip Title"
                value={tripTitle}
                onChangeText={setTripTitle}
            />

            <TextInput
                style={styles.input}
                placeholder="Description"
                value={tripDescription}
                onChangeText={setTripDescription}
                multiline
            />

            <TextInput
                style={styles.input}
                placeholder="Date (e.g. 2025-03-20)"
                value={tripDate}
                onChangeText={setTripDate}
            />

            <TouchableOpacity style={styles.button} onPress={handlePublish}>
                <Text style={styles.buttonText}>Publish Trip</Text>
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
    title: {
        fontSize: 24,
        color: "#fff",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#333",
        color: "#fff",
        borderRadius: 5,
    },
    button: {
        backgroundColor: "#d9534f",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});
