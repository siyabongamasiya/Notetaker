import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';

export type CategoryCardProps = {
  name: 'work' | 'study' | 'personal' | string;
  count: number;
  icon?: React.ReactNode; 
  color?: string; 
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  squareSize?: number;
  borderRadius?: number; 
  squareRadius?: number; 
};

const DEFAULT_COLORS: Record<string, string> = {
  work: '#3D7DFF',
  study: '#AA48FF',
  personal: '#E50A77',
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  count,
  icon,
  color,
  onPress,
  style,
  squareSize = 64,
  borderRadius = 16,
  squareRadius = 14,
}) => {
  const upperName = name?.toString().toLowerCase();
  const resolvedColor = color ?? DEFAULT_COLORS[upperName] ?? '#3D7DFF';
  const notesLabel = `${count} note${count === 1 ? '' : 's'}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, { borderRadius }, style]}
    >
      <View
        style={[
          styles.square,
          {
            width: squareSize,
            height: squareSize,
            borderRadius: squareRadius,
            backgroundColor: resolvedColor,
          },
        ]}
      >
        <View style={styles.iconWrap}>{icon}</View>
      </View>

      <View style={styles.textCol}>
        <Text style={styles.title}>{capitalize(name)}</Text>
        <Text style={styles.subtitle}>{notesLabel}</Text>
      </View>
    </TouchableOpacity>
  );
};

function capitalize(v: string) {
  if (!v) return '';
  const s = v.toString();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCol: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default CategoryCard;
