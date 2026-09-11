# The Hidden Thread — flujo OpenCode y subagentes

Este documento describe la arquitectura propuesta para coordinar la producción del canal con OpenCode. No contiene claves, tokens ni credenciales. Las credenciales deben mantenerse fuera del repositorio, dentro de `.secrets/` o mediante variables de entorno.

## Objetivo

Usar un agente principal para tomar decisiones editoriales y un subagente especializado para producir los vídeos. La comunicación entre ambos se realiza mediante archivos verificables dentro del proyecto.

```text
Astra, dirección editorial
    ↓
production_plan.json + guion + storyboard + fuentes
    ↓
Luna, producción y operaciones
    ↓
HyperFrames + voz Michael + renders + publicación
```

## Reparto de responsabilidades

### Astra: editorial-director

Modelo previsto: `gpt-6-astra`.

Debe:

- investigar noticias virales recientes y detectar cuál tiene mejor conflicto, impacto y potencial visual;
- consultar varias fuentes actuales y separar hechos, declaraciones, análisis, rumores e inferencias;
- crear tres hooks alternativos para los primeros 5–10 segundos;
- elegir un hook polémico, claro y defendible que genere debate sin inventar controversia;
- escribir el guion largo y la adaptación vertical;
- crear títulos, descripciones, hashtags y preguntas para comentarios;
- definir la metáfora visual y las animaciones exclusivas del episodio;
- crear `BRIEF.md`, `SCRIPT.md`, `STORYBOARD.md`, `SOURCES.md` y `production_plan.json`;
- delegar la producción cuando el plan esté completo y validado.

### Luna: video-producer

Modelo previsto: `gpt-5.6-luna`.

Debe:

- leer el plan editorial y no cambiar el ángulo sin dejar constancia;
- recopilar o preparar los medios aprobados y conservar sus fuentes;
- ejecutar HyperFrames y respetar sus skills y contrato;
- generar la narración local con Kokoro y `am_michael`;
- crear subtítulos sincronizados;
- renderizar el vídeo largo 16:9 y el short vertical 9:16;
- ejecutar `lint`, `check`, preview y revisión de los renders;
- preparar las subidas para YouTube y TikTok;
- usar YouTube privado y TikTok como borrador cuando la API esté disponible;
- registrar el resultado en `VIDEO_LOG.txt`;
- limpiar los artefactos del episodio después de verificar la publicación.

## Estructura de un episodio

```text
videos/<slug-del-tema>/
├── BRIEF.md
├── SCRIPT.md
├── STORYBOARD.md
├── SOURCES.md
├── MEDIA_MANIFEST.json
├── production_plan.json
├── audio_meta.json
├── index.html
└── exports/
    ├── <slug>-long.mp4
    └── <slug>-short.mp4
```

`production_plan.json` es el contrato entre agentes. Debe incluir, como mínimo:

```json
{
  "slug": "topic-slug",
  "language": "en",
  "hook_options": ["...", "...", "..."],
  "selected_hook": "...",
  "main_question": "...",
  "angle": "...",
  "sources": [
    {"title": "...", "url": "...", "accessed": "YYYY-MM-DD"}
  ],
  "voice": "am_michael",
  "long_duration_seconds": 300,
  "short_duration_seconds": 50,
  "visual_concept": "...",
  "status": "ready_for_production"
}
```

## Configuración conceptual de OpenCode

La configuración del proyecto puede usar un `opencode.json` con un agente principal y un subagente:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "editorial-director": {
      "mode": "primary",
      "model": "openai/gpt-6-astra",
      "prompt": "{file:./agents/editorial-director.md}",
      "permission": {
        "read": "allow",
        "edit": "allow",
        "bash": "allow",
        "websearch": "allow",
        "task": {
          "video-producer": "allow"
        }
      }
    },
    "video-producer": {
      "mode": "subagent",
      "model": "openai/gpt-5.6-luna",
      "prompt": "{file:./agents/video-producer.md}",
      "permission": {
        "read": "allow",
        "edit": "allow",
        "bash": "allow",
        "websearch": "allow"
      }
    }
  }
}
```

Los nombres de modelo siguen el formato `provider/model-id`. La disponibilidad exacta debe comprobarse en la instalación local mediante `/models`.

## Conectar la cuenta

En OpenCode:

```text
/connect
```

Después se selecciona `OpenAI` y `ChatGPT Plus/Pro`, se completa la autenticación en el navegador y se comprueban los modelos con:

```text
/models
```

OpenCode también admite API keys y otros proveedores. No copiar claves al `opencode.json` ni a ningún archivo que se vaya a subir a GitHub.

## Ejecución del flujo

La orden de inicio prevista es:

```text
Crea el siguiente episodio de The Hidden Thread sobre la noticia viral más interesante de hoy. Investiga, crea el guion y delega la producción a @video-producer.
```

El agente debe seguir este orden:

1. Leer `CANAL_WORKFLOW.md` y `VIDEO_LOG.txt`.
2. Astra investigar y crear el plan editorial.
3. Validar que hay fuentes suficientes y que el hook inicial es claro y defendible.
4. Astra guardar el plan y delegar a Luna.
5. Luna generar medios, audio, composición, subtítulos y renders.
6. Luna ejecutar las comprobaciones de HyperFrames.
7. Luna preparar las publicaciones.
8. Mantener los contenidos privados o como borradores hasta la confirmación final.
9. Registrar enlaces y limpiar los temporales tras la verificación.

## Permisos y seguridad

- Astra puede investigar, escribir archivos y delegar producción.
- Luna puede editar el episodio y ejecutar las herramientas locales.
- Las credenciales de YouTube y TikTok nunca se guardan en Git.
- `git push`, publicación pública y borrado de archivos deben requerir aprobación o una regla explícita del usuario.
- La API de TikTok se mantiene en modo de subida como borrador mientras `Direct Post` esté desactivado.
- La publicación pública debe comprobar cuenta, archivo, título, descripción, privacidad y formato antes del clic final.

## OpenCode y Computer Use

OpenCode puede trabajar con archivos, comandos, agentes y proveedores configurados. Conectar la cuenta de OpenAI a OpenCode no le concede automáticamente acceso a la extensión de Chrome ni al control nativo de este ordenador dentro de ChatGPT.

Para controlar Chrome desde OpenCode habría que configurar una herramienta compatible, como Playwright, Chrome DevTools o un servidor MCP de navegador. Mientras eso no exista, Computer Use de ChatGPT seguirá siendo la vía para manejar las sesiones autenticadas del navegador.

Por tanto, el diseño recomendado es:

```text
OpenCode + Astra: investigación y dirección
OpenCode + Luna: producción local y APIs
Computer Use de ChatGPT: navegador autenticado cuando sea necesario
Usuario: confirmación de publicación pública
```

## Fuentes oficiales

- OpenCode Providers: https://opencode.ai/docs/providers
- OpenCode Agents: https://opencode.ai/docs/agents/
- OpenAI Model Guidance: https://developers.openai.com/api/docs/guides/latest-model
- GPT-5.6 Luna: https://developers.openai.com/api/docs/models/gpt-5.6-luna
