import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import EditText from '@/components/shared/EditText';
import Button from '@/components/shared/Button';

export type RegisterCardProps = {
  style?: StyleProp<ViewStyle>;
  initialUsername?: string;
  initialEmail?: string;
  initialPassword?: string;
  onSubmit?: (values: { username: string; email: string; password: string }) => void;
  onLoginPress?: () => void;
  submitText?: string;
  borderRadius?: number;
};

const RegisterCard: React.FC<RegisterCardProps> = ({
  style,
  initialUsername = '',
  initialEmail = '',
  initialPassword = '',
  onSubmit,
  onLoginPress,
  submitText = 'Create Account',
  borderRadius = 16,
}) => {
  const [username, setUsername] = React.useState(initialUsername);
  const [email, setEmail] = React.useState(initialEmail);
  const [password, setPassword] = React.useState(initialPassword);

  const handleSubmit = () => {
    onSubmit?.({ username, email, password });
  };

  return (
    <View style={[styles.card, { borderRadius }, style]}>
      <View style={styles.stack}>
        <EditText
          label="Username"
          placeholder="Enter your username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          borderRadius={12}
        />
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
          style={styles.loginRow}
          onPress={onLoginPress}
          accessibilityRole="button"
          activeOpacity={0.7}
        >
          <Text style={styles.loginLabel}>Already have an account? </Text>
          <Text style={styles.loginLink}>Login</Text>
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
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  loginLabel: {
    color: '#111827',
    fontSize: 14,
  },
  loginLink: {
    color: '#3B7DFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterCard;
