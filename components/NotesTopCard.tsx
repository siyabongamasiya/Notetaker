import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  ColorValue,
  TextInput,
} from "react-native";
// removed expo-linear-gradient to use solid background color
import { Ionicons } from "@expo/vector-icons";

export type NotesTopCardProps = {
  title: string;
  onBack?: () => void;
  category: "work" | "study" | "personal";
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  backSquareSize?: number;
  backSquareRadius?: number;
  onSearch?: (text: string) => void;
};

// Helper: blend mid color between two hex colors
function parseHexColor(hex: string): [number, number, number] | null {
  const normalized = hex.trim().replace(/^#/, "");
  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16);
    const g = parseInt(normalized[1] + normalized[1], 16);
    const b = parseInt(normalized[2] + normalized[2], 16);
    return [r, g, b];
  }
  if (normalized.length === 6) {
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return [r, g, b];
  }
  return null;
}
function toHex(n: number): string {
  const clamped = Math.max(0, Math.min(255, Math.round(n)));
  return clamped.toString(16).padStart(2, "0");
}
function blendMidColor(c1: string, c2: string): string | null {
  const a = parseHexColor(c1);
  const b = parseHexColor(c2);
  if (!a || !b) return null;
  const r = (a[0] + b[0]) / 2;
  const g = (a[1] + b[1]) / 2;
  const bl = (a[2] + b[2]) / 2;
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

// Map category to gradient color
const categoryColors: Record<string, string> = {
  work: "#3B7DFF",
  study: "#AA48FF",
  personal: "#E70076",
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

  const startColor = categoryColors[category] || "#3B7DFF";
  const endColor = blendMidColor(startColor, "#FFFFFF") || startColor;

  const gradientConfig = useMemo(() => {
    const mid = blendMidColor(startColor, endColor);
    return mid
      ? { colors: [startColor, mid, endColor], locations: [0, 0.5, 1] as const }
      : { colors: [startColor, endColor] };
  }, [startColor, endColor]);

  return (
    <View style={[styles.card, { borderRadius, backgroundColor: startColor }, style as any]}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={onBack}
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#9CA3AF"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Search notes..."
          placeholderTextColor="#D1D5DB"
          style={styles.searchInput}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            onSearch && onSearch(text);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    backgroundColor: "rgba(249, 250, 252, 0.4)",
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
    backgroundColor: "rgba(255,255,255,0.15)",
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
