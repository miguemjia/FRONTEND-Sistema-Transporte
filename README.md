# Frontend Sistema de Transporte

Aplicación frontend desarrollada con Angular para consumir la API del sistema de transporte.

## Video

Enlace al video explicativo: [https://example.com/video-explicativo](https://youtu.be/cHr6kj0vJOs)

> Reemplaza esta URL con el enlace real del video antes de entregar el repositorio.

## Requisitos

- Node.js 18 o superior.
- npm.
- La API del backend ejecutándose en local o en la URL que corresponda.

## Instalación

1. Ubícate en la carpeta del frontend:

   ```bash
   cd FRONTEND-Sistema-Transporte
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

## Configuración de la API

La URL base de la API se configura en los archivos de entorno de Angular:

- `src/enviroments/environments.ts`
- `src/enviroments/environment.prod.ts`

Por defecto, el proyecto apunta a:

```ts
apiUrl: 'http://127.0.0.1:8000'
```

Si tu backend corre en otra dirección, cambia ese valor por la URL correcta antes de ejecutar la aplicación.

## Ejecución local

Para levantar la aplicación en modo desarrollo:

```bash
npm start
```

La aplicación quedará disponible normalmente en `http://localhost:4200/`.

## Compilación

Si necesitas generar la versión de producción:

```bash
npm run build
```
