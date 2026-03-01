import Globe from "@/components/Globe";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function StartScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      style={styles.container}
    >
      {/* <Text style={styles.emoji}>🌍</Text> */}
      <Globe />
      <Text style={styles.title}>Flag Guesser</Text>
      <Text style={styles.subtitle}>How many flags can you guess?</Text>
      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/game")}
        >
          <LinearGradient
            colors={["#e94560", "#c23152"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Flag Mode 🇮🇳</Text>
          </LinearGradient>
        </Pressable>
        {/* <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/")}
        >
          <LinearGradient
            colors={["#e94560", "#c23152"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Riddle Mode 💭</Text>
          </LinearGradient>
        </Pressable> */}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "85%",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 2,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#a8b2d8",
    marginBottom: 60,
  },
  button: {
    borderRadius: 30,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    shadowOpacity: 0.2,
  },
  buttonGradient: {
    paddingHorizontal: 25,
    paddingVertical: 18,
    borderRadius: 30,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
