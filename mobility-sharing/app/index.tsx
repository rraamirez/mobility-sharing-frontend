import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(username, password);
      router.replace("/profile");
    } catch {
      alert("Incorrect username or password");
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          Redefining movement. Driving the future.
        </Text>
        <Text style={styles.title}>Mobility Sharing</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Fondo negro
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  input: {
    width: 280,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderColor: "white",
  },
  button: {
    width: 280,
    backgroundColor: "#fff",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 15,
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 10,
    textAlign: "center",
    fontStyle: "italic",
    width: 600,
  },
});
