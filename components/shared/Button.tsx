import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacityProps, StyleProp, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Utility: parse hex color and blend two colors 50/50 to create a mid color
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
  const r = (rgb1[0] + rgb2[0]) / 2;
  const g = (rgb1[1] + rgb2[1]) / 2;
  const b = (rgb1[2] + rgb2[2]) / 2;
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

type ButtonProps = TouchableOpacityProps & {
  text?: string;
  title?: string; // optional fallback for existing usages
  onPress?: TouchableOpacityProps['onPress'];
  onClick?: TouchableOpacityProps['onPress']; // alias for web-like naming
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  startColor?: ColorValue;
  endColor?: ColorValue;
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
};
const Button: React.FC<ButtonProps> = ({
  text,
  title,
  onPress,
  onClick,
  style,
  textStyle,
  disabled = false,
  startColor = '#3B7DFF',
  endColor = '#AA48FF',
  width = '100%',
  height = 50,
  borderRadius = 25,
  ...rest
}) => {
  const canBlend = typeof startColor === 'string' && typeof endColor === 'string';
  const mid = canBlend ? blendMidColor(startColor as string, endColor as string) : null;
  const label = text ?? title ?? '';
  const handlePress: TouchableOpacityProps['onPress'] = onPress ?? onClick ?? (() => {});
  const disabledEffective = disabled || !(onPress || onClick);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabledEffective}
      activeOpacity={0.8}
      style={[styles.button, { width, height, opacity: disabledEffective ? 0.6 : 1 }, style]}
      {...rest}
    >
      {mid ? (
        <LinearGradient
          colors={[startColor, mid, endColor] as readonly [ColorValue, ColorValue, ColorValue]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.gradient, { borderRadius }]}
        >
          <Text style={[styles.text, textStyle]}>{label}</Text>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={[startColor, endColor] as readonly [ColorValue, ColorValue]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.gradient, { borderRadius }]}
        >
          <Text style={[styles.text, textStyle]}>{label}</Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button;
