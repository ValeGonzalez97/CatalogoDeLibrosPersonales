import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { supabase } from '../services/supabase';
import { READING_STATUSES, GENRES, createEmptyBook } from '../models/Book';

export default function AddEditBookScreen({ navigation, route }) {
  const existingBook = route.params?.book;

  const [form, setForm] = useState(
    existingBook
      ? {
          title: existingBook.title,
          author: existingBook.author,
          genre: existingBook.genre,
          status: existingBook.status,
          rating: existingBook.rating,
          notes: existingBook.notes || '',
        }
      : createEmptyBook(),
  );
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) {
      Alert.alert('Campo requerido', 'El título es obligatorio.');
      return false;
    }
    if (!form.author.trim()) {
      Alert.alert('Campo requerido', 'El autor es obligatorio.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const payload = {
        ...form,
        user_id: user.id,
        rating: Number(form.rating),
      };

      if (existingBook) {
        const { error } = await supabase
          .from('books')
          .update(payload)
          .eq('id', existingBook.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('books').insert([payload]);
        if (error) throw error;
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo guardar el libro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Cien años de soledad"
          placeholderTextColor="#aaa"
          value={form.title}
          onChangeText={(v) => updateField('title', v)}
        />

        {/* Author */}
        <Text style={styles.label}>Autor *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Gabriel García Márquez"
          placeholderTextColor="#aaa"
          value={form.author}
          onChangeText={(v) => updateField('author', v)}
        />

        {/* Genre */}
        <Text style={styles.label}>Género</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipRow}
        >
          {GENRES.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.chip, form.genre === g && styles.chipSelected]}
              onPress={() => updateField('genre', g)}
            >
              <Text
                style={[
                  styles.chipText,
                  form.genre === g && styles.chipTextSelected,
                ]}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Reading status */}
        <Text style={styles.label}>Estado de lectura</Text>
        <View style={styles.statusRow}>
          {READING_STATUSES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.statusChip,
                form.status === s && styles.statusChipSelected,
              ]}
              onPress={() => updateField('status', s)}
            >
              <Text
                style={[
                  styles.statusText,
                  form.status === s && styles.statusTextSelected,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rating */}
        <Text style={styles.label}>Calificación</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => updateField('rating', star)}
            >
              <Text style={styles.star}>
                {star <= form.rating ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <Text style={styles.label}>Notas personales</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Escribe tus impresiones, citas favoritas..."
          placeholderTextColor="#aaa"
          value={form.notes}
          onChangeText={(v) => updateField('notes', v)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {existingBook ? 'Guardar cambios' : 'Agregar libro'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  inner: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dce1e7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#4a90d9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#4a90d9',
  },
  chipText: {
    color: '#4a90d9',
    fontSize: 13,
  },
  chipTextSelected: {
    color: '#fff',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statusChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#4a90d9',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  statusChipSelected: {
    backgroundColor: '#4a90d9',
  },
  statusText: {
    color: '#4a90d9',
    fontSize: 13,
    fontWeight: '600',
  },
  statusTextSelected: {
    color: '#fff',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 8,
  },
  star: {
    fontSize: 32,
    color: '#f4b942',
  },
  saveButton: {
    backgroundColor: '#4a90d9',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 28,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
