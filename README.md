# VID-SKOOL - Plataforma de Aprendizaje de Idiomas con Video

Este proyecto es una aplicación [Next.js](https://nextjs.org) para el aprendizaje de idiomas basado en videos, con características específicas para "English Speaking Club".

## Características Principales

- **Gestión de videos**: Subida, procesamiento y reproducción de contenido educativo
- **Sistema de playlists**: Creación y gestión de colecciones de videos
- **Transcripciones automáticas**: Generación de subtítulos para videos
- **Área de estudio**: Interfaz dedicada para educadores y creadores de contenido
- **Autenticación de usuarios**: Integración con Clerk para gestión de cuentas

## Estructura del Proyecto

El proyecto utiliza la arquitectura de aplicación App Router de Next.js con la siguiente estructura:

```
src/
├── app/             # Rutas y páginas de la aplicación
│   ├── (auth)/      # Rutas de autenticación
│   ├── (home)/      # Rutas principales de navegación
│   ├── (studio)/    # Área de estudio para creadores
│   └── api/         # Endpoints de API
├── components/      # Componentes reutilizables
├── db/             # Configuración y modelos de base de datos
├── hooks/          # Hooks personalizados
├── lib/            # Utilidades y funciones auxiliares
├── modules/        # Módulos funcionales organizados por dominio
│   ├── auth/       # Funcionalidad de autenticación
│   ├── playlists/  # Gestión de playlists
│   └── studio/     # Funcionalidad del área de estudio
└── trpc/           # Configuración de tRPC para API tipada
```

## Tecnologías Utilizadas

- **Frontend**: React 19, Next.js 15, TailwindCSS
- **Backend**: Next.js API Routes, tRPC
- **Base de datos**: NeonDB (PostgreSQL) con Drizzle ORM
- **Autenticación**: Clerk
- **Procesamiento de video**: Mux
- **Transcripciones**: IA para generación de subtítulos
- **Despliegue**: Vercel

## Comenzando

### Requisitos Previos

- Node.js 18+ o Bun
- Cuenta en servicios externos:
  - Clerk (autenticación)
  - Mux (procesamiento de video)
  - NeonDB (base de datos)
  - UploadThing (almacenamiento de archivos)

### Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   bun install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env.local` basado en `.env.example` con las siguientes variables:
   ```
   # URL de la aplicación
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Autenticación Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
   CLERK_SIGNING_SECRET=
   
   # Base de datos
   DATABASE_URL=
   
   # Redis (Upstash)
   UPSTASH_REDIS_REST_URL=
   UPSTASH_REDIS_REST_TOKEN=
   
   # Mux para procesamiento de video
   MUX_TOKEN_ID=
   MUX_TOKEN_SECRET=
   MUX_WEBHOOK_SECRET=
   
   # QStash para tareas en cola
   QSTASH_TOKEN=
   UPSTASH_WORKFLOW_URL=https://your-tunnel.ngrok.app
   QSTASH_CURRENT_SIGNING_KEY=
   QSTASH_NEXT_SIGNING_KEY=
   
   # UploadThing para almacenamiento de archivos
   UPLOADTHING_TOKEN=
   
   # API para transcripciones
   OPENAI_API_KEY=
   DEEPSEEK_API_KEY=
   ```

4. Inicializa la base de datos:
   ```bash
   bun db:push
   ```

### Configuración de Webhooks

La aplicación utiliza webhooks para comunicarse con servicios externos:

#### Configuración de Webhook de Clerk

1. Accede al panel de administración de Clerk
2. Ve a "Webhooks" y crea un nuevo webhook
3. Configura la URL del endpoint como: `{NEXT_PUBLIC_APP_URL}/api/users/webhook`
4. Selecciona los eventos a escuchar:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copia el "Signing Secret" y colócalo en la variable de entorno `CLERK_SIGNING_SECRET`

#### Configuración de Webhook de Mux

1. Accede al panel de administración de Mux
2. Ve a "Settings" > "Webhooks" y crea un nuevo webhook
3. Configura la URL del endpoint como: `{NEXT_PUBLIC_APP_URL}/api/videos/webhook`
4. Selecciona los eventos a escuchar:
   - `video.asset.created`
   - `video.asset.ready`
   - `video.asset.errored`
   - `video.asset.deleted`
   - `video.asset.track.ready`
5. Genera un nuevo "Signing Secret" y colócalo en la variable de entorno `MUX_WEBHOOK_SECRET`

#### Configuración de túnel para desarrollo local

Para probar webhooks en entorno local:
1. Instala ngrok: `npm install -g ngrok`
2. Ejecuta: `ngrok http 3000`
3. Usa la URL generada por ngrok como base para tus webhooks
4. Actualiza `UPSTASH_WORKFLOW_URL` con la URL de ngrok

### Desarrollo

Para ejecutar el entorno de desarrollo:

```bash
# Ejecutar solo el servidor de desarrollo
bun dev

# Ejecutar servidor y webhook para desarrollo completo
bun dev:all
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Workflows de Video

El proyecto incluye flujos de trabajo automatizados para videos:
- Generación de títulos
- Creación de descripciones
- Procesamiento de subtítulos

Los webhooks manejan automáticamente:
- Creación de activos de video cuando se suben
- Actualización de metadatos cuando están listos
- Manejo de errores en procesamiento
- Generación de miniaturas y previsualizaciones
- Seguimiento del estado de las pistas de subtítulos

## Despliegue

La aplicación está optimizada para ser desplegada en Vercel:

```bash
bun build
```

Asegúrate de configurar todas las variables de entorno en tu plataforma de despliegue y actualizar las URLs de webhook a tu dominio de producción.
