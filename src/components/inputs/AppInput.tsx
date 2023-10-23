import React, {memo} from 'react';
import {StyleSheet, TextInput} from 'react-native';

interface Props {
  placeholder: string;
  value: string;
  action: (value: string) => void;
  multiline?: boolean;
}

const AppInput: React.FC<Props> = ({
  value,
  action,
  placeholder,
  multiline = false,
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={value => {
        action(value);
      }}
      multiline={multiline}
      style={styles.inputStyle}
    />
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: 'white',
    fontWeight: '500',
    borderRadius: 15,
    shadowRadius: 10,
    shadowOpacity: 0.1,
    shadowColor: 'blue',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 20,
    borderColor: '#27d5b5',
  },
});
export default memo(AppInput);
