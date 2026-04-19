import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

/**
 * SearchBar – a simple text input for searching books.
 *
 * Props:
 *  - value        {string}    Current search text
 *  - onChangeText {function}  Callback on text change
 */
export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="🔍  Buscar por título o autor..."
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        clearButtonMode="while-editing"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e8edf5',
  },
  input: {
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 15,
    color: '#333',
  },
});
