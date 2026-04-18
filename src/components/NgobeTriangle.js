import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export default function NgobeTriangle({ color = theme.colors.accent, size = 20, style }) {
  return (
    <View
      style={[
        styles.triangle,
        {
          borderBottomWidth: size,
          borderLeftWidth: size / 2,
          borderRightWidth: size / 2,
          borderBottomColor: color,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
