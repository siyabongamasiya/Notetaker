import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type LogoutButtonProps = {
  onPress?: (e: GestureResponderEvent) => void;
  style?: any;
};

const LogoutButton: React.FC<LogoutButtonProps> = ({ onPress, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.button, style]}
    >
      <View style={styles.content}>
        <Ionicons name="log-out-outline" size={18} color="#3B7DFF" />
        <Text style={styles.text}>Logout</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3B7DFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 8,
    color: '#3B7DFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LogoutButton;
