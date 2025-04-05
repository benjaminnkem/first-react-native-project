import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";

export default function SongDetails() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1">
      <ThemedView className=" border-4 border-red-600">
        <ThemedText>ID: {id}</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
