import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { supabase } from '../services/supabase';

const STATUS_COLORS = {
  Leído: '#27ae60',
  Leyendo: '#f39c12',
  Pendiente: '#95a5a6',
};

export default function BookDetailScreen({ navigation, route }) {
  const { book } = route.params;

  const handleDelete = () => {
    Alert.alert('Eliminar libro', '¿Estás seguro de que deseas eliminarlo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('books')
              .delete()
              .eq('id', book.id);
            if (error) throw error;
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el libro.');
          }
        },
      },
    ]);
  };

  const stars = '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <View style={styles.header}>
        <Text style={styles.bookIcon}>📚</Text>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>por {book.author}</Text>
        <Text style={styles.stars}>{stars}</Text>
      </View>

      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[book.status] || '#95a5a6' }]}>
          <Text style={styles.badgeText}>{book.status}</Text>
        </View>
        <View style={styles.genreBadge}>
          <Text style={styles.genreBadgeText}>{book.genre}</Text>
        </View>
      </View>

      {book.notes ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Notas personales</Text>
          <Text style={styles.notes}>{book.notes}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Agregado el</Text>
        <Text style={styles.dateText}>
          {new Date(book.created_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('AddEditBook', { book })}
        >
          <Text style={styles.editButtonText}>✏️ Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>🗑 Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  inner: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bookIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  stars: {
    fontSize: 24,
    color: '#f4b942',
    letterSpacing: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  genreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e8edf5',
    borderWidth: 1,
    borderColor: '#c5d0df',
  },
  genreBadgeText: {
    color: '#4a6fa5',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#444',
    marginBottom: 8,
  },
  notes: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  dateText: {
    fontSize: 15,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#4a90d9',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
