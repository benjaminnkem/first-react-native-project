import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, Text, View } from "react-native";

const Contact = () => {
  return (
    <View style={styles.container}>
      <ThemedText>Contact Us</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    color: "blue",
  },
});

export default Contact;
