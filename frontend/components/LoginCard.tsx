import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import EditText from '@/components/shared/EditText';
import Button from '@/components/shared/Button';

export type LoginCardProps = {
  style?: StyleProp<ViewStyle>;
  initialEmail?: string;
  initialPassword?: string;
  onSubmit?: (credentials: { email: string; password: string }) => void;
  onRegisterPress?: () => void;
  submitText?: string;
  borderRadius?: number;
};

const LoginCard: React.FC<LoginCardProps> = ({
  style,
  initialEmail = '',
  initialPassword = '',
  onSubmit,
  onRegisterPress,
  submitText = 'Login',
  borderRadius = 16,
}) => {
  const [email, setEmail] = React.useState(initialEmail);
  const [password, setPassword] = React.useState(initialPassword);

  const handleSubmit = async() => {
    onSubmit?.({ email, password });
  };

  return (
    <View style={[styles.card, { borderRadius }, style]}>
      <View style={styles.stack}>
        <EditText
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          borderRadius={12}
        />
        <EditText
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          borderRadius={12}
        />
        <Button
          text={submitText}
          onClick={handleSubmit}
          height={52}
          borderRadius={14}
        />
        <TouchableOpacity
          style={styles.registerRow}
          onPress={onRegisterPress}
          accessibilityRole="button"
          activeOpacity={0.7}
        >
          <Text style={styles.registerLabel}>Don't have an account? </Text>
          <Text style={styles.registerLink}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  stack: {
    gap: 14,
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  registerLabel: {
    color: '#111827',
    fontSize: 14,
  },
  registerLink: {
    color: '#3B7DFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginCard;
