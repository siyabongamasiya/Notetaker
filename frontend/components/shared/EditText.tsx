import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  TextInputProps,
} from 'react-native';

export type EditTextProps = TextInputProps & {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  borderRadius?: number;
  errorText?: string;
  helperText?: string;
};

const EditText: React.FC<EditTextProps> = ({
  label,
  containerStyle,
  inputStyle,
  labelStyle,
  borderRadius = 12,
  errorText,
  helperText,
  ...inputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      <TextInput
        placeholderTextColor="#9CA3AF"
        style={[
          styles.input,
          { borderRadius },
          inputStyle,
        ]}
        {...inputProps}
      />
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
      {!errorText && helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: 6,
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#000000',
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    marginTop: 6,
    color: '#DC2626',
    fontSize: 12,
  },
  helperText: {
    marginTop: 6,
    color: '#6B7280',
    fontSize: 12,
  },
});

export default EditText;
