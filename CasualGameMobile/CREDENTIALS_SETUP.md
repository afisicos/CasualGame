# Configuración de Credenciales

## ⚠️ IMPORTANTE - Seguridad

Este proyecto requiere un archivo `credentials.json` para firmar las builds de Android, pero **NUNCA** debes subir este archivo al repositorio por razones de seguridad.

## Configuración Local

1. Copia el archivo de ejemplo:
   ```bash
   cp credentials.example.json credentials.json
   ```

2. Edita `credentials.json` y reemplaza los valores de ejemplo con tus credenciales reales:
   - `keystorePassword`: Contraseña de tu keystore
   - `keyAlias`: Alias de tu key
   - `keyPassword`: Contraseña de tu key

3. El archivo `credentials.json` está en `.gitignore`, así que no se subirá al repositorio.

## Para Nuevos Desarrolladores

Si eres un nuevo desarrollador del proyecto:

1. Solicita las credenciales al administrador del proyecto de forma segura (NO por email ni repositorio)
2. Sigue los pasos de "Configuración Local" arriba
3. Verifica que el archivo `credentials.json` aparezca como "ignorado" en tu sistema de control de versiones

## ¿Por qué es importante?

Las credenciales del keystore permiten firmar aplicaciones Android. Si estas credenciales se comprometen:
- Alguien podría crear versiones falsas de la app firmadas con tus claves
- Perderías el control sobre las actualizaciones en Google Play Store
- Sería necesario crear un nuevo keystore y nueva aplicación en la tienda

## Más Información

- [Documentación de EAS Build](https://docs.expo.dev/build/introduction/)
- [Gestión de Credenciales con EAS](https://docs.expo.dev/app-signing/local-credentials/)
