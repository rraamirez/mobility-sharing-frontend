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

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const isFormValid = name && email && username && password;

  const handleRegister = async () => {
    try {
      const response = await register(name, email, username, password);
      if (!response.success) {
        alert(response.message);
        return;
      } else {
        alert("Registration successful!");
        router.replace("/");
      }
    } catch {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          Join the movement. Drive the future.
        </Text>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          disabled={!isFormValid}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.registerText}>
            Already have an account? Log in
          </Text>
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
    backgroundColor: "#000",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 10,
    textAlign: "center",
    fontStyle: "italic",
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
});
