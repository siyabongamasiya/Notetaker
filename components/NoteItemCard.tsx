import React from "react";
import { View, Text, StyleSheet } from "react-native";

type NoteItemCardProps = {
  title?: string;
  description: string;
  date: string | Date;
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
}) => {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
        {description}
      </Text>

      <Text style={styles.date}>{formatDate(date)}</Text>
    </View>
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
