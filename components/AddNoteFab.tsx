import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

type AddNoteFabProps = {
  onPress: (event: GestureResponderEvent) => void;
  color?: string; // background color
};

const AddNoteFab: React.FC<AddNoteFabProps> = ({
  onPress,
  color = "#3B82F6",
}) => {
  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.plus}>+</Text>
    </TouchableOpacity>
  );
};

export default AddNoteFab;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  plus: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
    lineHeight: 28,
  },
});
