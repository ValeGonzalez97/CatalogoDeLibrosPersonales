import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { GENRES, READING_STATUSES } from '../models/Book';

const ALL_GENRES = ['Todos', ...GENRES];
const ALL_STATUSES = ['Todos', ...READING_STATUSES];

/**
 * FilterBar provides horizontal chip lists for filtering by genre and status.
 *
 * Props:
 *  - selectedGenre   {string}    Currently selected genre
 *  - onGenreChange   {function}  Callback when genre changes
 *  - selectedStatus  {string}    Currently selected status
 *  - onStatusChange  {function}  Callback when status changes
 */
export default function FilterBar({
  selectedGenre,
  onGenreChange,
  selectedStatus,
  onStatusChange,
}) {
  return (
    <View style={styles.container}>
      {/* Genre filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.row}
      >
        {ALL_GENRES.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.chip, selectedGenre === g && styles.chipSelected]}
            onPress={() => onGenreChange(g)}
          >
            <Text
              style={[
                styles.chipText,
                selectedGenre === g && styles.chipTextSelected,
              ]}
            >
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Status filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.row}
      >
        {ALL_STATUSES.map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.chip,
              styles.statusChip,
              selectedStatus === s && styles.statusChipSelected,
            ]}
            onPress={() => onStatusChange(s)}
          >
            <Text
              style={[
                styles.chipText,
                selectedStatus === s && styles.chipTextSelected,
              ]}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e8edf5',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 6,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#4a90d9',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#4a90d9',
  },
  statusChip: {
    borderColor: '#7b68ee',
  },
  statusChipSelected: {
    backgroundColor: '#7b68ee',
    borderColor: '#7b68ee',
  },
  chipText: {
    fontSize: 12,
    color: '#4a90d9',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});
