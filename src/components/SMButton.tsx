import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface Props {
  action: () => void;
  text: string;
  color: 'green' | 'blue' | 'red';
}

const colors = {
  green: '#27d5b5',
  blue: '#2156c9',
  red: '#cc2121',
};
const SMButton: React.FC<Props> = ({action, text, color}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        style={[styles.buttonLayout, {backgroundColor: colors[color]}]}
        onPress={action}>
        <Text style={styles.buttonTitle}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonLayout: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 10,
    shadowRadius: 10,
    shadowColor: 'blue',
  },
  buttonTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: 'white',
  },
});
export default memo(SMButton);
