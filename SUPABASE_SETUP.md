# Configuración de Supabase para Piggy Bank

## Pasos para configurar Supabase:

### 1. Crear un proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL del proyecto y la clave anónima

### 2. Configurar las variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 3. Configurar autenticación en Supabase

1. Ve a Authentication > Settings en tu dashboard de Supabase
2. Habilita "Enable email confirmations" si quieres que los usuarios confirmen su email
3. Configura las URLs de redirección en Authentication > URL Configuration:
   - Site URL: `http://localhost:3000` (para desarrollo)
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 4. Configurar la base de datos

Crea la tabla `user_profiles` para almacenar la información específica del usuario:

```sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  email TEXT NOT NULL,
  private_pk TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Crear políticas para que los usuarios solo puedan ver/editar su propio perfil
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 5. Estructura de datos del usuario

El sistema maneja los siguientes campos para cada usuario:

- **wallet_address**: Dirección de la wallet del usuario
- **email**: Email del usuario (usado para autenticación)
- **password**: Contraseña del usuario (encriptada por Supabase)
- **private_pk**: Clave privada del usuario (encriptada)

### 6. Funcionalidades implementadas

- ✅ Registro de usuarios con wallet_address, email, password y private_pk
- ✅ Login de usuarios con email y password
- ✅ Logout
- ✅ Manejo de errores de autenticación
- ✅ Estado global de autenticación
- ✅ Persistencia de sesión
- ✅ Visualización de wallet address en el header
- ✅ Actualización de perfil de usuario

### 7. Uso en componentes

```tsx
import { useAuthContext } from "../contexts/AuthContext";

function MyComponent() {
  const { user, userProfile, signIn, signOut } = useAuthContext();

  if (user) {
    return (
      <div>
        <p>Email: {userProfile?.email}</p>
        <p>Wallet: {userProfile?.wallet_address}</p>
      </div>
    );
  }

  return <div>Por favor inicia sesión</div>;
}
```

### 8. Seguridad

- Las claves privadas se almacenan encriptadas en la base de datos
- Row Level Security (RLS) está habilitado para proteger los datos
- Los usuarios solo pueden acceder a su propio perfil
- Las contraseñas se manejan de forma segura a través de Supabase Auth

### 9. Próximos pasos sugeridos

- Implementar recuperación de contraseña
- Agregar autenticación con Google/GitHub
- Crear páginas protegidas
- Implementar middleware de autenticación
- Agregar validación de wallet addresses
- Implementar encriptación adicional para private_pk
- Agregar funcionalidad de cambio de wallet address
