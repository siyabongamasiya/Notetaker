import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type NoteItemCardProps = {
  title?: string;
  description: string;
  date: string | Date;
  onPress?: () => void;
  onDelete?: () => void;
};

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const NoteItemCard: React.FC<NoteItemCardProps> = ({
  title,
  description,
  date,
  onPress,
  onDelete,
}) => {
  return (
    <TouchableOpacity activeOpacity={onPress ? 0.8 : 1} onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {onDelete ? (
            <TouchableOpacity
              onPress={onDelete}
              style={styles.deleteBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
          {description}
        </Text>

        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NoteItemCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
  },
});
