import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      router.push("/components/login");
    }
  }, [isReady, router]);

  return (
    <View style={styles.container}>
      <Text>Redirecting to Login...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
