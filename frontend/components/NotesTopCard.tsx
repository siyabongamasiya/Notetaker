import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export type NotesTopCardProps = {
  title: string;
  onBack?: () => void;
  category: "All" | "Work" | "Study" | "Personal";
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  backSquareSize?: number;
  backSquareRadius?: number;
  onSearch?: (text: string) => void;
};

/* ---------------- COLOR HELPERS ---------------- */

function parseHexColor(hex: string): [number, number, number] | null {
  const normalized = hex.replace("#", "");
  if (normalized.length === 6) {
    return [
      parseInt(normalized.slice(0, 2), 16),
      parseInt(normalized.slice(2, 4), 16),
      parseInt(normalized.slice(4, 6), 16),
    ];
  }
  return null;
}

function toHex(n: number) {
  return Math.round(Math.max(0, Math.min(255, n)))
    .toString(16)
    .padStart(2, "0");
}

function blendMidColor(c1: string, c2: string): string {
  const a = parseHexColor(c1);
  const b = parseHexColor(c2);
  if (!a || !b) return c1;
  return `#${toHex((a[0] + b[0]) / 2)}${toHex((a[1] + b[1]) / 2)}${toHex(
    (a[2] + b[2]) / 2
  )}`;
}

/* CATEGORY COLORS*/

const categoryColors: Record<NotesTopCardProps["category"], string> = {
  All: "#6B7280",
  Work: "#3B7DFF",
  Study: "#AA48FF",
  Personal: "#E70076",
};

const NotesTopCard: React.FC<NotesTopCardProps> = ({
  title,
  onBack,
  category,
  style,
  borderRadius = 16,
  backSquareSize = 42,
  backSquareRadius = 12,
  onSearch,
}) => {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const startColor = categoryColors[category];
  const endColor = blendMidColor(startColor, "#FFFFFF");

  useMemo(() => {
    blendMidColor(startColor, endColor);
  }, [startColor]);

  return (
    <View
      style={[
        styles.card,
        { borderRadius, backgroundColor: startColor },
        style as any,
      ]}
    >
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => {
            if (onBack) return onBack();
            if ((router as any).back) return (router as any).back();
            router.replace("/home");
          }}
          activeOpacity={0.8}
          style={[
            styles.backSquare,
            {
              width: backSquareSize,
              height: backSquareSize,
              borderRadius: backSquareRadius,
            },
          ]}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#E5E7EB"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Search notes..."
          placeholderTextColor="#E5E7EB"
          style={styles.searchInput}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            onSearch?.(text);
          }}
        />
      </View>
    </View>
  );
};

/* STYLES*/

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  backSquare: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  title: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
  },
});

export default NotesTopCard;
