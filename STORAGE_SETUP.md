# Configuración de Supabase Storage

## Problema Actual
El bucket 'images' no existe en Supabase Storage, causando error 404.

## Solución Manual (Recomendada)

### 1. Crear Bucket en Supabase Dashboard:
1. Ve a tu [Dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Storage** en el menú lateral
4. Haz clic en **"Create Bucket"**
5. Nombre del bucket: `images`
6. **Public bucket**: ✅ (habilitado)
7. Haz clic en **"Create bucket"**

### 2. Configurar Políticas RLS (Row Level Security):
Una vez creado el bucket, necesitas configurar las políticas:

```sql
-- Política para SUBIR archivos (solo usuarios autenticados)
CREATE POLICY "Users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- Política para VER archivos (público)
CREATE POLICY "Images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Política para ACTUALIZAR archivos (solo el propietario)
CREATE POLICY "Users can update own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para ELIMINAR archivos (solo el propietario)
CREATE POLICY "Users can delete own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Estructura de Carpetas:
Los archivos se guardarán en:
```
images/
├── trip-covers/
│   ├── {tripId}/
│   │   └── {timestamp}.{ext}
```

## Solución Automática (Ya implementada)
El código intenta crear el bucket automáticamente si no existe, pero puede fallar por permisos.

## Verificación
Una vez configurado, deberías poder:
1. Subir imágenes desde la aplicación
2. Ver las imágenes en el Storage dashboard
3. Las URLs públicas funcionarán correctamente