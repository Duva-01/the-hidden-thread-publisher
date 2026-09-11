# The Hidden Thread — instrucciones maestras para la IA

Este documento es el contexto operativo del canal. Léelo al iniciar una conversación nueva sobre producción, edición o publicación.

## 1. Identidad del canal

**Nombre:** The Hidden Thread  
**Canal de YouTube:** https://www.youtube.com/@TheHiddenThread01  
**Idioma del contenido:** inglés.  
**Formato:** documentales faceless, narrados, con gráficos animados y subtítulos.  
**Promesa:** revelar las decisiones, incentivos, conflictos y sistemas ocultos detrás de las noticias que afectan a la vida real.

El tono debe ser inteligente, visual, claro y provocador sin caer en conspiraciones, datos inventados o clickbait engañoso. El objetivo es que el espectador piense: “nunca había conectado estas cosas así”.

La prioridad editorial es la actualidad viral: antes de decidir el tema, buscar qué noticias, historias o conversaciones están generando más interés y seleccionar las que tengan una explicación interesante, un conflicto, una sorpresa o un impacto real. El canal no se limita a guerras, política o mercados.

Temáticas posibles:

- noticias virales de última hora y acontecimientos inesperados;
- política, geopolítica, guerras y tensiones internacionales;
- finanzas personales, préstamos, hipotecas, deuda, inflación y coste de vida;
- economía, empresas, mercados y desigualdad;
- tecnología, IA, redes sociales, plataformas y cultura de internet;
- ciencia, salud pública, clima, energía, espacio e innovación;
- entretenimiento, deportes, cultura, escándalos corporativos y fenómenos sociales, siempre que exista un ángulo explicativo y verificable;
- vivienda, infraestructura, ciudades, instituciones, incentivos y efectos no intencionados;
- cualquier historia viral que pueda convertirse en una narrativa visual con contexto y consecuencias.

Ejemplos de enfoques: “the AI war that could reshape who controls intelligence”, “why a loan can become more expensive after you sign it”, “what the Israel–Palestine escalation changes beyond the battlefield” o “why governments can announce a solution and still make the problem worse”. Estos ejemplos son ángulos editoriales, no afirmaciones de hechos concretos.

## 2. Entregables por tema

Crear dos piezas relacionadas:

1. **Vídeo largo para YouTube:** normalmente 4–7 minutos, formato 16:9, 1920×1080.
2. **Short/Reel/TikTok:** 45–60 segundos, formato vertical 9:16, 1080×1920. Debe ser una adaptación propia del tema, con un gancho más rápido; no es simplemente recortar el vídeo largo.

Usar siempre el archivo vertical original para Instagram, TikTok y YouTube Shorts. No recortar, reencuadrar, estirar ni volver a exportar el short salvo que el usuario lo pida expresamente.

## 3. Flujo de producción

### Paso A — elegir y verificar el tema

1. Consultar `VIDEO_LOG.txt` para no repetir temas ni ángulos.
2. Hacer una exploración de tendencias recientes: Google Trends, YouTube, TikTok, Instagram, Reddit y medios de referencia sirven para detectar interés, pero una tendencia social no es por sí sola una fuente factual.
3. Puntuar cada candidato por velocidad, volumen de conversación, sorpresa, conflicto, impacto en la audiencia y capacidad de explicarlo con gráficos. Elegir temas con potencial de comentarios, no solo con muchas visualizaciones.
4. Comprobar la fecha y buscar varias fuentes recientes: fuentes primarias, comunicados oficiales, organismos públicos, documentos académicos, datos empresariales verificables y medios de referencia con líneas editoriales distintas.
5. Distinguir siempre entre hecho confirmado, declaración de una parte, análisis, estimación, rumor e inferencia. No convertir una acusación o un post viral en un hecho.
6. Priorizar el contexto sobre la reacción: explicar qué ocurrió, por qué se volvió viral, quién se ve afectado, qué incentivos existen y qué puede pasar después.
7. Guardar fuentes, enlaces y fecha de consulta en el proyecto del episodio y citarlas en la descripción.
8. Si una noticia sigue desarrollándose, decirlo claramente en la narración. No presentar un dato histórico como actual ni una cifra ilustrativa como promedio nacional.
9. El tono puede ser polémico en la pregunta y en el encuadre, pero nunca debe depender de desinformación, ataques personales, odio, imágenes engañosas o clickbait que prometa algo que el vídeo no demuestra.

### Paso B — diseñar la historia

El vídeo debe responder una pregunta concreta. Estructura recomendada:

1. **Hook de 0–5 s:** contradicción, pregunta o imagen imposible de ignorar.
2. **Promesa:** qué conexión va a descubrir el espectador.
3. **Contexto mínimo:** solo lo necesario para entender el problema.
4. **Mecanismo:** explicar las causas con una cadena visual de decisiones e incentivos.
5. **Giro o paradoja:** lo que parece la solución no resuelve el cuello de botella.
6. **Implicación:** qué significa para una persona normal.
7. **Cierre:** “the hidden thread” + pregunta concreta para comentarios.

El short debe abrir con la idea más fuerte, introducir una sola paradoja y terminar con una pregunta que invite a elegir, discutir o aportar una experiencia.

### Paso C — HyperFrames

HyperFrames es el framework por defecto. Para un tema explicado con visuales inventados, usar el flujo `faceless-explainer`.

En una conversación nueva:

1. Leer primero la skill `hyperframes`.
2. Leer las skills necesarias: `faceless-explainer`, `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `media-use` y `hyperframes-cli`.
3. Crear el proyecto nuevo en `videos/<slug-del-tema>`.
4. Crear y mantener `BRIEF.md`, `STORYBOARD.md`, `SCRIPT.md`, `frame.md`, `audio_meta.json` e `index.html` según el contrato de HyperFrames.
5. Usar siempre narración en inglés con Kokoro local y la voz oficial `am_michael` (Michael, masculina, inglés estadounidense). No cambiar de voz salvo que el propietario del canal lo solicite expresamente.
6. Generar subtítulos con los tiempos del audio y revisarlos.
7. Ejecutar `lint`, `check`, snapshots/contact sheet y preview antes del render final.
8. Renderizar el vídeo largo y el short en sus resoluciones respectivas.
9. Antes de animar, hacer un pase de medios: recopilar imágenes, capturas, mapas, gráficos o vídeos relevantes de la noticia y registrar su fuente, fecha, licencia o permiso de uso. Guardar los archivos aprobados dentro del proyecto del episodio.

No escribir HTML improvisado sin respetar el contrato de HyperFrames. Las duraciones deben venir del audio real; no ajustar a mano para ocultar desincronizaciones.

### Identidad visual propia de cada episodio

El canal debe ser reconocible, pero los episodios no deben parecer plantillas repetidas. Cada episodio necesita una **idea visual central** derivada de la noticia antes de escribir el HTML:

- definir en `BRIEF.md` una imagen o metáfora visual dominante, una paleta, una textura, un tratamiento tipográfico y un motivo de transición propios;
- utilizar imágenes reales o de referencia relacionadas con la noticia: fotografías periodísticas con uso permitido, capturas de fuentes oficiales, mapas, documentos, titulares, gráficos de datos y material de archivo correctamente atribuido;
- no presentar imágenes generadas o ilustrativas como si fueran fotografías reales del acontecimiento; marcar visualmente o en la narración cuando algo sea una recreación;
- diseñar al menos una animación exclusiva del episodio que explique la historia, no solo un gráfico genérico: por ejemplo, una red de nodos que se expande para una noticia de IA, una interfaz que se fragmenta para una crisis digital, una ciudad que se comprime para vivienda, una cadena de fichas que cae para deuda o un mapa que cambia de escala para geopolítica;
- variar la gramática visual entre episodios: collage documental, mapa vivo, timeline físico, simulación de sistema, archivo de titulares, objetos 3D/2.5D, tipografía que reacciona a la narración o composición de datos en movimiento;
- hacer que cada transición tenga una razón narrativa y que la animación revele causalidad, escala, conflicto o consecuencia. No añadir efectos únicamente para decorar;
- conservar solo los elementos de marca —tono, legibilidad, subtítulos, voz y cierre— y cambiar la puesta en escena para que cada noticia tenga su propia personalidad.

El storyboard debe indicar qué imagen o material de la noticia aparece en cada escena, qué dato o fuente respalda la escena y cuál es la animación específica que la hace única.

## 4. Dirección visual y engagement

La animación es parte del argumento, no decoración. Evitar diapositivas estáticas con texto largo.

Reglas visuales:

- cambio visual o micro-movimiento cada 1–3 segundos;
- cambios de escala, enfoque, posición o jerarquía para crear ritmo;
- tipografía cinética para palabras clave, no párrafos completos;
- diagramas causales, mapas, timelines, contadores, barras, bloques y redes de conexiones;
- datos que se dibujan o transforman en pantalla, con unidades y contexto;
- transiciones motivadas: wipes, match cuts, whip pans, zooms y morphs cuando conecten ideas;
- parallax y profundidad para evitar sensación de plantilla plana;
- una imagen dominante por escena y una lectura clara en móvil;
- imágenes de la noticia integradas con tratamiento editorial: recortes, resaltados, zooms, escaneos, capas, mapas, documentos o titulares, siempre diferenciando evidencia de recreación;
- subtítulos grandes, contrastados y dentro de una zona segura;
- SFX puntuales para impactos, cambios de sección y revelaciones; música discreta que no compita con la voz.
- Importante añadir animaciones que enganchen al espectador!!

Patrón de ritmo recomendado:

- 0–2 s: golpe visual + frase corta;
- 2–8 s: planteamiento de la contradicción;
- 8–20 s: primer dato o ejemplo visual;
- después: alternar explicación, diagrama, dato y consecuencia;
- cada 15–25 s: introducir una nueva pregunta, escala o punto de vista;
- final: síntesis memorable + CTA específico.

Usar mayúsculas selectivas, emojis solo en títulos/captions sociales y miniaturas, y preguntas directas. Ser llamativo sin afirmar que algo es “secreto” o “increíble” si el vídeo no lo demuestra.

## 5. Voces, audio y media

- Narración principal en inglés.
- Usar TTS local Kokoro con `--voice am_michael` para controlar costes y privacidad.
- No clonar voces reales ni insinuar que la voz pertenece a una persona concreta.
- Usar música y SFX con licencia o procedentes de las herramientas autorizadas.
- Conservar la voz por encima de la música mediante ducking/carve.
- Los subtítulos deben proceder de la narración real y revisarse antes de publicar.

## 6. Publicación con Computer Use

Usar Computer Use para manejar las plataformas en el ordenador y Chrome para las sesiones autenticadas. Nunca pedir ni escribir contraseñas o códigos de verificación en el chat.

Antes de publicar:

1. Comprobar que la cuenta y el perfil visibles son los correctos.
2. Subir el archivo original correspondiente.
3. YouTube: publicar el largo y el short.
4. Instagram: publicar el short como Reel.
5. TikTok: publicar el short.
6. Incluir siempre este enlace en la descripción/caption de Instagram y TikTok: `https://www.youtube.com/@TheHiddenThread01`.
7. Usar títulos/captions con gancho, emojis, mayúsculas selectivas, pregunta para comentarios y hashtags relevantes.
8. En Instagram y TikTok conservar el formato vertical original 1080×1920.
9. Revisar privacidad, audiencia, caption y cuenta justo antes de publicar.
10. Pedir confirmación inmediatamente antes del clic final de **Compartir/Publicar** cuando la interfaz lo requiera.
11. Guardar los enlaces públicos reales en `VIDEO_LOG.txt`.

Si el selector de archivos de Windows no puede ser controlado automáticamente, pedir al usuario que seleccione manualmente el MP4 exacto. Eso no significa que haya que volver a exportar el vídeo.

## 7. Limpieza posterior

Solo limpiar después de verificar que las publicaciones están visibles y que los enlaces funcionan.

Eliminar del episodio terminado:

- MP4 exportados de `exports/`;
- `research/` del episodio;
- `videos/<episodio>/` completo, incluidos snapshots, audio, fuentes y caches;
- miniaturas y artefactos temporales que no sean necesarios para futuros episodios.

Conservar en la carpeta raíz:

- este documento y `VIDEO_LOG.txt`;
- `README.md`;
- `scripts/` si siguen siendo útiles como helpers;
- `.tools/` y `.venv/` para FFmpeg, render y voz local;
- plantillas de publicación y cualquier configuración genérica.

No borrar herramientas compartidas ni credenciales fuera del proyecto. Tras la limpieza, comprobar que el siguiente episodio puede arrancar sin depender de archivos del anterior.

## 8. Criterio de terminado

Un episodio está terminado cuando:

- el vídeo largo y el short pasan `hyperframes check`;
- se han revisado preview/snapshots;
- las fuentes están citadas;
- los MP4 se han renderizado correctamente;
- las publicaciones se han verificado en las cuentas correctas;
- `VIDEO_LOG.txt` registra el tema, ángulo, fecha y enlaces;
- se ha ejecutado la limpieza posterior.
