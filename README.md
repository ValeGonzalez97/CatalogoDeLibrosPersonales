# 📚 Catálogo de Libros Personales

Una app móvil desarrollada con **React Native + Expo** y **Supabase** que permite a los usuarios gestionar su catálogo personal de libros.

## Funcionalidades

- **Autenticación** – Registro e inicio de sesión con email y contraseña (Supabase Auth).
- **Agregar libros** – Título, autor, género, estado de lectura, calificación (1–5 estrellas) y notas personales.
- **Listar libros** – Vista de tarjetas con toda la información relevante.
- **Buscar** – Por título o autor en tiempo real.
- **Filtrar** – Por género y estado de lectura.
- **Editar y eliminar** – Directamente desde la lista o el detalle del libro.

## Estructura del proyecto

```
├── App.js                          # Punto de entrada
├── app.json                        # Configuración de Expo
├── package.json
├── .env.example                    # Variables de entorno de ejemplo
├── babel.config.js
└── src/
    ├── models/
    │   └── Book.js                 # Modelo y constantes del libro
    ├── services/
    │   └── supabase.js             # Cliente de Supabase
    ├── navigation/
    │   └── AppNavigator.js         # Configuración de navegación
    ├── screens/
    │   ├── LoginScreen.js          # Pantalla de login / registro
    │   ├── HomeScreen.js           # Lista de libros con búsqueda y filtros
    │   ├── AddEditBookScreen.js    # Formulario para agregar / editar
    │   └── BookDetailScreen.js     # Detalle completo del libro
    └── components/
        ├── BookCard.js             # Tarjeta de libro reutilizable
        ├── SearchBar.js            # Barra de búsqueda
        └── FilterBar.js            # Filtros por género y estado
```

## Configuración

### 1. Clonar e instalar dependencias

```bash
git clone <URL_DEL_REPOSITORIO>
cd CatalogoDeLibrosPersonales
npm install
```

### 2. Crear la base de datos en Supabase

En el **SQL Editor** de tu proyecto Supabase ejecuta:

```sql
-- Tabla de libros
CREATE TABLE books (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title      TEXT NOT NULL,
  author     TEXT NOT NULL,
  genre      TEXT NOT NULL DEFAULT 'Otro',
  status     TEXT NOT NULL DEFAULT 'Pendiente'
               CHECK (status IN ('Leído', 'Leyendo', 'Pendiente')),
  rating     INTEGER NOT NULL DEFAULT 1
               CHECK (rating >= 1 AND rating <= 5),
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Política: cada usuario sólo ve y modifica sus propios libros
CREATE POLICY "Users manage their own books"
  ON books
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con las credenciales de tu proyecto Supabase
(las encontrás en **Project Settings → API**):

```
EXPO_PUBLIC_SUPABASE_URL=https://<tu-project-id>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
```

### 4. Ejecutar la app

```bash
npx expo start
```

Abrí la app en tu dispositivo con **Expo Go** o en un emulador.

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| React Native | Framework móvil |
| Expo | Toolchain y build |
| @react-navigation/native | Navegación entre pantallas |
| @supabase/supabase-js | Backend (auth + base de datos) |
| AsyncStorage | Persistencia local de sesión |
