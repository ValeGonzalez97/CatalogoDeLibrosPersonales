import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const STATUS_COLORS = {
  Leído: '#27ae60',
  Leyendo: '#f39c12',
  Pendiente: '#95a5a6',
};

/**
 * BookCard displays a single book in the home screen list.
 *
 * Props:
 *  - book     {object}    Book data
 *  - onPress  {function}  Navigate to detail
 *  - onEdit   {function}  Navigate to edit
 *  - onDelete {function}  Trigger delete
 */
export default function BookCard({ book, onPress, onEdit, onDelete }) {
  const stars = '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating);
  const statusColor = STATUS_COLORS[book.status] || '#95a5a6';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>
          <Text style={styles.stars}>{stars}</Text>
        </View>

        <View style={styles.side}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{book.status}</Text>
          </View>
          <Text style={styles.genre} numberOfLines={1}>
            {book.genre}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
          <Text style={styles.editText}>✏️ Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
          <Text style={styles.deleteText}>🗑 Eliminar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  author: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  stars: {
    fontSize: 14,
    color: '#f4b942',
  },
  side: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  genre: {
    fontSize: 12,
    color: '#4a6fa5',
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 16,
  },
  actionBtn: {
    paddingVertical: 4,
  },
  editText: {
    color: '#4a90d9',
    fontSize: 13,
    fontWeight: '600',
  },
  deleteText: {
    color: '#e74c3c',
    fontSize: 13,
    fontWeight: '600',
  },
});
