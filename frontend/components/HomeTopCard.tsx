import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, StyleProp, ColorValue, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type HomeTopCardProps = {
  userName: string;
  profileImageUri?: string;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  startColor?: ColorValue; 
  endColor?: ColorValue;   
  onProfilePress?: () => void;
};

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
  const rgb1 = parseHexColor(c1);
  const rgb2 = parseHexColor(c2);
  if (!rgb1 || !rgb2) return null;
  const r = (rgb1[0] + rgb1[0] + rgb2[0]) / 3 + (rgb2[0] - rgb1[0]) / 3; // small bias towards end
  const g = (rgb1[1] + rgb1[1] + rgb2[1]) / 3 + (rgb2[1] - rgb1[1]) / 3;
  const b = (rgb1[2] + rgb1[2] + rgb2[2]) / 3 + (rgb2[2] - rgb1[2]) / 3;
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const HomeTopCard: React.FC<HomeTopCardProps> = ({
  userName,
  profileImageUri,
  style,
  borderRadius = 16,
  startColor = '#3B7DFF',
  endColor = '#AA48FF',
  onProfilePress,
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
        <View style={styles.col}>
          <Text style={styles.title}>Note Taker</Text>
          <Text style={styles.subtitle}>welcome back {userName}</Text>
        </View>
        {profileImageUri ? (
          <TouchableOpacity onPress={onProfilePress} activeOpacity={0.8}>
            <Image
              source={{ uri: profileImageUri }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onProfilePress} activeOpacity={0.8}>
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitials}>
                {userName?.trim()?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

const AVATAR_SIZE = 64;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 42,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  col: {
    flexDirection: 'column',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '500',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    backgroundColor: '#E5E7EB',
  },
  avatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#111827',
    fontWeight: '700',
  },
});

export default HomeTopCard;
