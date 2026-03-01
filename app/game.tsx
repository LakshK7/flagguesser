import { Country, getCountryPoolByStreak } from "@/data/countries";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function getRandomCountries(
  correct: Country,
  count: number,
  pool: Country[]
): Country[] {
  const filtered = pool.filter((c) => c.code !== correct.code);
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  const decoys = shuffled.slice(0, count).filter(Boolean);
  return [...decoys, correct].sort(() => Math.random() - 0.5);
}

export default function GameScreen() {
  const router = useRouter();
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadBestStreak = async () => {
    const stored = await AsyncStorage.getItem("bestStreak");
    if (stored) setBestStreak(parseInt(stored));
  };

  const saveBestStreak = async (value: number) => {
    await AsyncStorage.setItem("bestStreak", value.toString());
  };

  const loadRound = useCallback((currentStreak: number = 0) => {
    try {
      const pool = getCountryPoolByStreak(currentStreak);
      const randomIndex = Math.floor(Math.random() * pool.length);
      const correct = pool[randomIndex];
      const roundOptions = getRandomCountries(correct, 2, pool);
      setCurrentCountry(correct);
      setOptions(roundOptions);
      setSelected(null);

      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } catch (e) {
      console.error("Error in loadRound:", e);
    }
  }, []);

  useEffect(() => {
    loadBestStreak();
    loadRound(0);
  }, []);

  const handleAnswer = async (country: Country) => {
    if (selected) return;
    setSelected(country.code);

    if (country.code === currentCountry?.code) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        await saveBestStreak(newStreak);
      }
      setTimeout(() => loadRound(newStreak), 800);
    } else {
      setGameOver(true);
    }
  };

  if (gameOver) {
    return (
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.gameOverContent}>
          <Text style={styles.gameOverEmoji}>😢</Text>
          <Text style={styles.gameOverTitle}>Game Over!</Text>
          <Text style={styles.gameOverSubtitle}>You scored</Text>
          <Text style={styles.scoreText}>{streak}</Text>
          <Text style={styles.gameOverSubtitle}>Best streak: {bestStreak}</Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              setStreak(0);
              setGameOver(false);
              loadRound(0);
            }}
          >
            <LinearGradient
              colors={["#e94560", "#c23152"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Try Again 🔄</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.back()} style={styles.homeButton}>
            <Text style={styles.homeButtonText}>← Back to Home</Text>
          </Pressable>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.streakText}>🔥 {streak}</Text>
        <Text style={styles.bestText}>Best: {bestStreak}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.question}>Which country is this?</Text>

        {currentCountry && (
          <Animated.View
            style={[
              styles.flagContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Image
              source={{
                uri: `https://flagcdn.com/w320/${currentCountry.code}.png`,
              }}
              style={styles.flag}
              resizeMode="contain"
            />
          </Animated.View>
        )}

        <View style={styles.optionsContainer}>
          {options.filter(Boolean).map((option) => {
            const isSelected = selected === option.code;
            const isCorrect = option.code === currentCountry?.code;
            let buttonColors: [string, string] = ["#1e2a4a", "#162040"];
            if (isSelected && isCorrect) buttonColors = ["#27ae60", "#1e8449"];
            if (isSelected && !isCorrect) buttonColors = ["#e74c3c", "#c0392b"];

            return (
              <Pressable
                key={option.code}
                style={({ pressed }) => [
                  styles.optionButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => handleAnswer(option)}
              >
                <LinearGradient
                  colors={buttonColors}
                  style={styles.optionGradient}
                >
                  <Text style={styles.optionText}>{option.name}</Text>
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingBottom: 40,
  },
  gameOverContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  streakText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  bestText: {
    color: "#a8b2d8",
    fontSize: 18,
  },
  question: {
    color: "#a8b2d8",
    fontSize: 18,
    marginBottom: 24,
  },
  flagContainer: {
    width: 320,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 40,
  },
  flag: {
    width: "100%",
    height: "100%",
  },
  optionsContainer: {
    width: "100%",
    gap: 12,
  },
  optionButton: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  optionGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  optionText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
  button: {
    borderRadius: 30,
    marginTop: 30,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  homeButton: {
    marginTop: 16,
  },
  homeButtonText: {
    color: "#a8b2d8",
    fontSize: 16,
  },
  gameOverEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  gameOverTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  gameOverSubtitle: {
    fontSize: 16,
    color: "#a8b2d8",
  },
  scoreText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#e94560",
    marginVertical: 10,
  },
});
