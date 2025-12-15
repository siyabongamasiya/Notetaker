import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, StyleProp, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export type SimpleTopCardProps = {
  title: string;
  onBack?: () => void;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  startColor?: ColorValue; // gradient start (defaults to #3B7DFF)
  endColor?: ColorValue;   // gradient end (defaults to #AA48FF)
  backSquareSize?: number;
  backSquareRadius?: number;
};

// Helper: blend mid color between two hex colors (used to match button gradient feel)
function parseHexColor(hex: string): [number, number, number] | null {
  const normalized = hex.trim().replace(/^#/, '');
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
  return clamped.toString(16).padStart(2, '0');
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

const SimpleTopCard: React.FC<SimpleTopCardProps> = ({
  title,
  onBack,
  style,
  borderRadius = 16,
  startColor = '#3B7DFF',
  endColor = '#AA48FF',
  backSquareSize = 42,
  backSquareRadius = 12,
}) => {
  const gradientConfig = useMemo(() => {
    const canBlend = typeof startColor === 'string' && typeof endColor === 'string';
    const mid = canBlend ? blendMidColor(startColor as string, endColor as string) : null;
    if (mid) {
      return {
        colors: [startColor, mid, endColor] as const,
        locations: [0, 0.5, 1] as const,
      };
    }
    return { colors: [startColor, endColor] as const };
  }, [startColor, endColor]);

  return (
    <LinearGradient
      colors={gradientConfig.colors as readonly [ColorValue, ColorValue, ...ColorValue[]]}
      {...('locations' in gradientConfig ? { locations: gradientConfig.locations } : {})}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[styles.card, { borderRadius }, style as any]}
    >
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backSquare: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 250, 252, 0.4)', // subtle translucent gray
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default SimpleTopCard;
