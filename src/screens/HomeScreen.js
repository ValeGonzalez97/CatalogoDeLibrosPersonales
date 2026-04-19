import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los libros.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [fetchBooks]),
  );

  // Apply search and filters whenever books or filter values change
  const applyFilters = useCallback(() => {
    let result = [...books];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q),
      );
    }

    if (selectedGenre !== 'Todos') {
      result = result.filter((b) => b.genre === selectedGenre);
    }

    if (selectedStatus !== 'Todos') {
      result = result.filter((b) => b.status === selectedStatus);
    }

    setFilteredBooks(result);
  }, [books, searchQuery, selectedGenre, selectedStatus]);

  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleDelete = async (bookId) => {
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
              .eq('id', bookId);
            if (error) throw error;
            setBooks((prev) => prev.filter((b) => b.id !== bookId));
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el libro.');
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <FilterBar
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#4a90d9" style={styles.loader} />
      ) : filteredBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📖</Text>
          <Text style={styles.emptyText}>No se encontraron libros</Text>
          <Text style={styles.emptySubtext}>
            {books.length === 0
              ? 'Agrega tu primer libro con el botón +'
              : 'Prueba ajustando el filtro o la búsqueda'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onPress={() => navigation.navigate('BookDetail', { book: item })}
              onEdit={() => navigation.navigate('AddEditBook', { book: item })}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditBook')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    padding: 12,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 60,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4a90d9',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 36,
  },
  logoutButton: {
    position: 'absolute',
    right: 20,
    bottom: 14,
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 13,
    fontWeight: '600',
  },
});
