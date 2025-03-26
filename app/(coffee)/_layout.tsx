import { Slot, Stack } from "expo-router";

export default function CoffeeLayout() {
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="contact" />
  </Stack>;
}
