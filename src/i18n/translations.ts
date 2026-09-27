export type Locale = 'en' | 'es' | 'pt' | 'de' | 'fr' | 'ja';

export const LOCALES: { code: Locale; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
];

export interface TranslationSchema {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  nav: {
    features: string;
    howItWorks: string;
    faq: string;
    support: string;
    toggleTheme: string;
    selectLanguage: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
  };
  tool: {
    dropTitle: string;
    dropSubtitle: string;
    fileLoaded: string;
    changeFile: string;
    settingsTitle: string;
    presetLabel: string;
    presets: {
      podcast: string;
      audiobook: string;
      aggressive: string;
      gentle: string;
    };
    thresholdLabel: string;
    thresholdHelp: string;
    minSilenceLabel: string;
    minSilenceHelp: string;
    paddingLabel: string;
    paddingHelp: string;
    processButton: string;
    processingButton: string;
    reprocessButton: string;
    resultsTitle: string;
    originalDuration: string;
    trimmedDuration: string;
    timeSaved: string;
    silenceRemoved: string;
    cutsRemoved: string;
    previewTitle: string;
    listenOriginal: string;
    listenTrimmed: string;
    downloadWav: string;
    downloadMp3: string;
    encodingMp3: string;
    audioPlayerHelp: string;
    waveformLegendAudible: string;
    waveformLegendSilent: string;
  };
  features: {
    heading: string;
    subheading: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  howItWorks: {
    heading: string;
    subheading: string;
    steps: Array<{
      step: string;
      title: string;
      description: string;
    }>;
  };
  privacy: {
    heading: string;
    description: string;
    bullet1: string;
    bullet2: string;
    bullet3: string;
  };
  faq: {
    heading: string;
    subheading: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  footer: {
    tagline: string;
    supportButton: string;
    rights: string;
    privacyNote: string;
  };
}

export const translations: Record<Locale, TranslationSchema> = {
  en: {
    meta: {
      title: "SilenceRemover | Free Local Audio Silence Trimmer (100% Private)",
      description: "Instantly detect and remove silence, dead air, and long pauses from your audio files. 100% free, private, and client-side in your browser. No file uploads.",
      keywords: "silence remover, remove silence from audio, audio trimmer, cut silence podcast, free audio silence cleaner, web audio silence remover"
    },
    nav: {
      features: "Features",
      howItWorks: "How It Works",
      faq: "FAQ",
      support: "Support Developer",
      toggleTheme: "Toggle theme",
      selectLanguage: "Language"
    },
    hero: {
      badge: "100% Client-Side • Zero Server Uploads • Absolute Privacy",
      title: "Remove Silence From Audio",
      titleHighlight: "Instantly & Privately",
      subtitle: "Automatically cut awkward pauses, dead air, and breathing gaps from podcasts, interviews, and voiceovers. Processed entirely within your browser memory."
    },
    tool: {
      dropTitle: "Drag & drop your audio file here",
      dropSubtitle: "or click to select file (MP3, WAV, M4A, AAC, OGG, FLAC supported)",
      fileLoaded: "File loaded",
      changeFile: "Choose another file",
      settingsTitle: "Silence Detection Parameters",
      presetLabel: "Presets",
      presets: {
        podcast: "Podcast & Speech",
        audiobook: "Audiobook Clean",
        aggressive: "Aggressive Cut",
        gentle: "Gentle / Natural"
      },
      thresholdLabel: "Silence Threshold",
      thresholdHelp: "Sound quieter than this decibel (dB) level is identified as silence.",
      minSilenceLabel: "Minimum Silence Duration",
      minSilenceHelp: "Pauses longer than this threshold will be excised.",
      paddingLabel: "Safety Padding (Margin)",
      paddingHelp: "Adds a buffer before and after speech to keep word endings natural.",
      processButton: "Trim Silence Now",
      processingButton: "Analyzing Waveform & Slicing...",
      reprocessButton: "Update & Re-process",
      resultsTitle: "Trimming Overview",
      originalDuration: "Original Length",
      trimmedDuration: "Trimmed Length",
      timeSaved: "Time Saved",
      silenceRemoved: "Silence Stripped",
      cutsRemoved: "Silent Segments Removed",
      previewTitle: "Interactive Waveform & Preview",
      listenOriginal: "Original Audio",
      listenTrimmed: "Trimmed Audio",
      downloadWav: "Download Studio WAV (Lossless)",
      downloadMp3: "Download MP3",
      encodingMp3: "Encoding MP3 in browser...",
      audioPlayerHelp: "Click on the waveform to scrub. Listen to A/B comparison below.",
      waveformLegendAudible: "Active Speech",
      waveformLegendSilent: "Removed Silence"
    },
    features: {
      heading: "Engineered for Speed, Quality & Absolute Privacy",
      subheading: "Everything you need to produce tight, professional audio in seconds.",
      items: [
        {
          title: "100% Client-Side Processing",
          description: "Your audio never touches a remote server or cloud API. Computation happens locally using your browser's Web Audio engine."
        },
        {
          title: "Micro-Crossfade Technology",
          description: "Eliminates annoying clicks, pops, and sudden cuts using intelligent zero-crossing crossfades at every splice point."
        },
        {
          title: "Lossless Studio Quality",
          description: "Export uncompressed 16-bit PCM WAV or high-bitrate MP3 ready for publishing to Spotify, YouTube, or Apple Podcasts."
        },
        {
          title: "Interactive Waveform Inspection",
          description: "Visualize every cut before downloading. Scrub through active speech and preview before-and-after audio side by side."
        },
        {
          title: "No Limits, No Account Required",
          description: "No subscription fees, no watermarks, and no arbitrary file size limits. Free for creators, students, and professionals."
        },
        {
          title: "Universal Format Support",
          description: "Seamlessly decodes MP3, WAV, M4A, AAC, OGG, and FLAC using standard Web Audio codecs without external software."
        }
      ]
    },
    howItWorks: {
      heading: "How SilenceRemover Works in 3 Simple Steps",
      subheading: "Fast, accurate, and completely automated audio trimming.",
      steps: [
        {
          step: "01",
          title: "Upload Your Audio",
          description: "Drag and drop any audio file into the workspace. Your file is decoded into memory locally."
        },
        {
          step: "02",
          title: "Fine-tune Detection",
          description: "Pick a speech preset or adjust decibel (dB) threshold and minimum silence duration sliders to taste."
        },
        {
          step: "03",
          title: "Preview & Download",
          description: "Verify the trimmed audio on the interactive waveform, compare with the original, and download your trimmed file."
        }
      ]
    },
    privacy: {
      heading: "Zero-Server Privacy Guarantee",
      description: "Unlike other online audio tools that send your voice files to distant cloud servers, SilenceRemover operates 100% inside your browser session.",
      bullet1: "Your files never leave your computer or mobile device.",
      bullet2: "Zero logs, zero audio caching, zero telemetry on your voice data.",
      bullet3: "Fully functional even if you disconnect your internet after loading the page."
    },
    faq: {
      heading: "Frequently Asked Questions",
      subheading: "Everything you need to know about SilenceRemover.",
      items: [
        {
          question: "Is SilenceRemover really 100% free and private?",
          answer: "Yes, completely! SilenceRemover is powered by browser-native Web Audio API technology. Your audio file is never uploaded to any server; all decoding, silence detection, slicing, and stitching occur directly in your device's memory."
        },
        {
          question: "What audio formats can I process?",
          answer: "You can load MP3, WAV, M4A, AAC, OGG, FLAC, and WebM files. You can export the resulting trimmed audio as pristine Studio WAV (16-bit PCM) or optimized MP3."
        },
        {
          question: "What are the recommended settings for podcast dialogue?",
          answer: "For typical podcast speech, a Silence Threshold of -38 dB to -32 dB with a Minimum Silence Duration of 250ms to 400ms and Safety Padding of 40ms creates natural, fast-paced dialogue without clipping breath or word endings."
        },
        {
          question: "Will cutting silence cause popping or clicking sounds?",
          answer: "No. SilenceRemover applies smooth micro-crossfades across every splice point to ensure seamless transitions between active sound segments without digital clicks or pops."
        },
        {
          question: "Is there a file length or size limit?",
          answer: "Because processing runs entirely on your local machine, the only limit is your device's available RAM. You can comfortably process multi-hour podcast episodes and audiobooks."
        }
      ]
    },
    footer: {
      tagline: "Free, open, client-side audio silence trimmer for creators worldwide.",
      supportButton: "Buy Me a Coffee",
      rights: "All rights reserved. Built for creators.",
      privacyNote: "100% Client-Side. No audio is ever transmitted or stored."
    }
  },
  es: {
    meta: {
      title: "SilenceRemover | Eliminador de Silencios de Audio Gratis (100% Privado)",
      description: "Detecta y elimina silencios, pausas y ruidos de fondo de tus archivos de audio al instante. 100% gratis, privado y local en tu navegador.",
      keywords: "eliminar silencios audio, cortar silencio podcast, recortar pausas audio, silenciador audio gratis, herramienta web audio sin servidor"
    },
    nav: {
      features: "Características",
      howItWorks: "Cómo Funciona",
      faq: "Preguntas",
      support: "Apoyar al Creador",
      toggleTheme: "Cambiar tema",
      selectLanguage: "Idioma"
    },
    hero: {
      badge: "100% En el Navegador • Cero Servidores • Privacidad Total",
      title: "Elimina Silencios de tu Audio",
      titleHighlight: "Al Instante y en Privado",
      subtitle: "Recorta automáticamente pausas incómodas y vacíos en podcasts, locuciones y entrevistas. Procesado 100% en la memoria de tu navegador."
    },
    tool: {
      dropTitle: "Arrastra y suelta tu archivo de audio aquí",
      dropSubtitle: "o haz clic para seleccionar (Compatible con MP3, WAV, M4A, AAC, OGG, FLAC)",
      fileLoaded: "Archivo cargado",
      changeFile: "Elegir otro archivo",
      settingsTitle: "Parámetros de Detección de Silencio",
      presetLabel: "Preajustes",
      presets: {
        podcast: "Podcast y Voz",
        audiobook: "Audiolibro Limpio",
        aggressive: "Corte Rápido",
        gentle: "Suave / Natural"
      },
      thresholdLabel: "Umbral de Silencio (dB)",
      thresholdHelp: "Sonidos por debajo de este volumen en decibelios se consideran silencio.",
      minSilenceLabel: "Duración Mínima de Silencio",
      minSilenceHelp: "Las pausas que superen este tiempo serán eliminadas.",
      paddingLabel: "Margen de Seguridad (Padding)",
      paddingHelp: "Añade margen antes y después de cada palabra para conservar finales naturales.",
      processButton: "Recortar Silencio Ahora",
      processingButton: "Analizando Onda y Recortando...",
      reprocessButton: "Actualizar y Recalcular",
      resultsTitle: "Resumen del Recorte",
      originalDuration: "Duración Original",
      trimmedDuration: "Duración Final",
      timeSaved: "Tiempo Ahorrado",
      silenceRemoved: "Silencio Eliminado",
      cutsRemoved: "Segmentos Recortados",
      previewTitle: "Forma de Onda Interactiva y Vista Previa",
      listenOriginal: "Audio Original",
      listenTrimmed: "Audio Recortado",
      downloadWav: "Descargar WAV de Estudio (Sin Pérdida)",
      downloadMp3: "Descargar MP3",
      encodingMp3: "Codificando MP3 en el navegador...",
      audioPlayerHelp: "Haz clic en la forma de onda para desplazarte. Compara original y procesado abajo.",
      waveformLegendAudible: "Voz Activa",
      waveformLegendSilent: "Silencio Eliminado"
    },
    features: {
      heading: "Diseñado para Velocidad, Calidad y Privacidad Absoluta",
      subheading: "Todo lo necesario para obtener audios dinámicos y profesionales en segundos.",
      items: [
        {
          title: "Procesamiento 100% en el Navegador",
          description: "Tus archivos nunca se envían a ningún servidor externo. Todo ocurre localmente mediante Web Audio API."
        },
        {
          title: "Micro-Transiciones Suaves",
          description: "Evita chasquidos y cortes abruptos con transiciones cruzadas automáticas en cada unión de audio."
        },
        {
          title: "Calidad de Estudio Sin Pérdida",
          description: "Exporta en formato WAV de 16 bits sin compresión o en MP3 de alta fidelidad para tus publicaciones."
        },
        {
          title: "Forma de Onda Interactiva",
          description: "Inspecciona visualmente cada corte antes de descargar. Compara antes y después en tiempo real."
        },
        {
          title: "Sin Límites ni Registros",
          description: "Sin suscripciones, sin marcas de agua y sin límites de tamaño. Completamente libre y gratuito."
        },
        {
          title: "Compatibilidad Universal",
          description: "Decodifica MP3, WAV, M4A, AAC, OGG y FLAC de forma nativa sin instalar ningún programa adicional."
        }
      ]
    },
    howItWorks: {
      heading: "Cómo Funciona SilenceRemover en 3 Pasos",
      subheading: "Corte de silencios rápido, preciso y automático.",
      steps: [
        {
          step: "01",
          title: "Carga tu Audio",
          description: "Arrastra y suelta tu archivo en el panel. Se decodificará directamente en la memoria local."
        },
        {
          step: "02",
          title: "Ajusta la Sensibilidad",
          description: "Elige un preajuste o ajusta los deslizadores de decibelios (dB) y duración mínima según tu gusto."
        },
        {
          step: "03",
          title: "Escucha y Descarga",
          description: "Verifica el resultado en el reproductor interactivo y descarga tu archivo limpio en WAV o MP3."
        }
      ]
    },
    privacy: {
      heading: "Garantía de Privacidad Total Sin Servidores",
      description: "A diferencia de otras herramientas que suben tu voz a la nube, SilenceRemover funciona 100% en tu propio equipo.",
      bullet1: "Tus audios jamás salen de tu ordenador o teléfono móvil.",
      bullet2: "Cero registros, cero almacenamiento remoto, cero rastreo.",
      bullet3: "Funciona incluso si desconectas internet tras cargar la web."
    },
    faq: {
      heading: "Preguntas Frecuentes",
      subheading: "Todo lo que necesitas saber sobre SilenceRemover.",
      items: [
        {
          question: "¿Es SilenceRemover realmente gratuito y privado?",
          answer: "¡Sí, al 100%! Funciona íntegramente con la tecnología Web Audio API de tu navegador. Tus audios nunca viajan por internet."
        },
        {
          question: "¿Qué formatos de audio son compatibles?",
          answer: "Admite MP3, WAV, M4A, AAC, OGG, FLAC y WebM. Puedes exportar en WAV de estudio (PCM 16 bits) o MP3 de alta fidelidad."
        },
        {
          question: "¿Qué configuración se recomienda para podcasts?",
          answer: "Un umbral de -36 dB con una duración mínima de 300ms y un margen (padding) de 40ms produce un ritmo natural sin cortar consonantes."
        },
        {
          question: "¿Los cortes causan chasquidos o ruidos raros?",
          answer: "No. SilenceRemover aplica micro-fundidos cruzados en cada unión para garantizar un sonido limpio e imperceptible."
        },
        {
          question: "¿Hay límite de duración de audio?",
          answer: "El único límite es la memoria RAM de tu dispositivo. Puedes procesar audios de varias horas sin ningún problema."
        }
      ]
    },
    footer: {
      tagline: "Herramienta gratuita y privada de eliminación de silencios de audio.",
      supportButton: "Invítame a un Café",
      rights: "Todos los derechos reservados. Diseñado para creadores.",
      privacyNote: "100% en tu navegador. Tus audios nunca se transfieren a ningún servidor."
    }
  },
  pt: {
    meta: {
      title: "SilenceRemover | Removedor de Silêncio de Áudio Grátis (100% Privado)",
      description: "Detecte e remova pausas, silêncios e ruídos dos seus áudios instantaneamente no navegador. 100% gratuito, privado e sem servidores.",
      keywords: "remover silêncio áudio, cortar pausas podcast, cortador de silêncio grátis, editor áudio sem servidor, web audio silêncio"
    },
    nav: {
      features: "Recursos",
      howItWorks: "Como Funciona",
      faq: "Perguntas",
      support: "Apoiar o Criador",
      toggleTheme: "Alternar tema",
      selectLanguage: "Idioma"
    },
    hero: {
      badge: "100% No Navegador • Zero Servidores • Privacidade Absoluta",
      title: "Remova Silêncios de Áudio",
      titleHighlight: "Rápido e com Privacidade",
      subtitle: "Corte automaticamente pausas longas e respirações de podcasts, audiobooks e entrevistas. Processado inteiramente na memória do seu navegador."
    },
    tool: {
      dropTitle: "Arraste e solte seu arquivo de áudio aqui",
      dropSubtitle: "ou clique para selecionar (Compatível com MP3, WAV, M4A, AAC, OGG, FLAC)",
      fileLoaded: "Arquivo carregado",
      changeFile: "Escolher outro arquivo",
      settingsTitle: "Parâmetros de Detecção de Silêncio",
      presetLabel: "Predefinições",
      presets: {
        podcast: "Podcast e Voz",
        audiobook: "Audiolivro Limpo",
        aggressive: "Corte Rápido",
        gentle: "Suave / Natural"
      },
      thresholdLabel: "Limite de Silêncio (dB)",
      thresholdHelp: "Sons abaixo desse nível de decibéis serão tratados como silêncio.",
      minSilenceLabel: "Duração Mínima do Silêncio",
      minSilenceHelp: "Pausas maiores que este intervalo de tempo serão removidas.",
      paddingLabel: "Margem de Segurança (Padding)",
      paddingHelp: "Adiciona uma margem antes e após as falas para manter as palavras naturais.",
      processButton: "Remover Silêncio Agora",
      processingButton: "Analisando Onda e Cortando...",
      reprocessButton: "Atualizar e Reprocessar",
      resultsTitle: "Resumo do Processamento",
      originalDuration: "Duração Original",
      trimmedDuration: "Duração Final",
      timeSaved: "Tempo Economizado",
      silenceRemoved: "Silêncio Cortado",
      cutsRemoved: "Segmentos Removidos",
      previewTitle: "Forma de Onda Interativa e Prévia",
      listenOriginal: "Áudio Original",
      listenTrimmed: "Áudio Cortado",
      downloadWav: "Baixar WAV de Estúdio (Sem Perdas)",
      downloadMp3: "Baixar MP3",
      encodingMp3: "Codificando MP3 no navegador...",
      audioPlayerHelp: "Clique na forma de onda para navegar. Ouça a comparação abaixo.",
      waveformLegendAudible: "Voz Ativa",
      waveformLegendSilent: "Silêncio Removido"
    },
    features: {
      heading: "Construído para Velocidade, Qualidade e Privacidade",
      subheading: "Tudo o que você precisa para produzir áudios profissionais em segundos.",
      items: [
        {
          title: "Processamento 100% no Cliente",
          description: "Seu áudio nunca é enviado a nenhum servidor na nuvem. A computação é local usando Web Audio API."
        },
        {
          title: "Micro-Crossfades Sem Ruído",
          description: "Elimina estalos e cortes repentinos com transições suaves em cada ponto de junção do áudio."
        },
        {
          title: "Qualidade de Estúdio Sem Perdas",
          description: "Exporte WAV não compactado em 16 bits ou MP3 pronto para distribuição no Spotify e YouTube."
        },
        {
          title: "Forma de Onda Interativa",
          description: "Visualize todos os trechos cortados antes do download e compare com o áudio original."
        },
        {
          title: "Sem Limites nem Cadastro",
          description: "Sem taxas de assinatura, marcas d'água ou limites arbitrários de tamanho de arquivo."
        },
        {
          title: "Compatibilidade Universal",
          description: "Decodifica MP3, WAV, M4A, AAC, OGG e FLAC nativamente no seu navegador."
        }
      ]
    },
    howItWorks: {
      heading: "Como o SilenceRemover Funciona em 3 Passos",
      subheading: "Corte de silêncios rápido, exato e automático.",
      steps: [
        {
          step: "01",
          title: "Envie seu Áudio",
          description: "Arraste e solte o arquivo no espaço de trabalho. O áudio é lido diretamente na memória."
        },
        {
          step: "02",
          title: "Ajuste os Parâmetros",
          description: "Escolha uma predefinição ou ajuste o limiar em decibéis e duração mínima conforme desejar."
        },
        {
          step: "03",
          title: "Ouça e Baixe",
          description: "Confira o resultado na forma de onda interativa e faça o download do áudio limpo em WAV ou MP3."
        }
      ]
    },
    privacy: {
      heading: "Garantia de Privacidade Sem Servidores",
      description: "Ao contrário de outros sites que enviam suas gravações para a nuvem, o SilenceRemover roda 100% no seu dispositivo.",
      bullet1: "Seus arquivos nunca saem do seu computador ou celular.",
      bullet2: "Zero logs, zero armazenamento e zero rastreamento de voz.",
      bullet3: "Funciona até mesmo sem conexão à internet após o carregamento inicial."
    },
    faq: {
      heading: "Perguntas Frequentes",
      subheading: "Tudo o que você precisa saber sobre o SilenceRemover.",
      items: [
        {
          question: "O SilenceRemover é realmente gratuito e seguro?",
          answer: "Sim, 100%! O aplicativo utiliza a Web Audio API do navegador. Seus arquivos de voz nunca trafegam pela internet."
        },
        {
          question: "Quais formatos são aceitos?",
          answer: "MP3, WAV, M4A, AAC, OGG, FLAC e WebM. É possível exportar em WAV de estúdio (16 bits) ou MP3 otimizado."
        },
        {
          question: "Quais são os ajustes ideais para podcasts?",
          answer: "Um limiar de -35 dB a -38 dB com duração mínima de silêncio de 250ms a 350ms e margem de 40ms garante ritmo fluido e natural."
        },
        {
          question: "O corte de silêncio gera ruídos de clique?",
          answer: "Não. Aplicamos micro-crossfades automáticos em cada emenda para assegurar transições suaves e sem estalos."
        },
        {
          question: "Existe limite de tamanho de arquivo?",
          answer: "O limite depende apenas da memória RAM livre do seu dispositivo. É possível processar episódios longos com tranquilidade."
        }
      ]
    },
    footer: {
      tagline: "Removedor de silêncio de áudio gratuito e 100% local para criadores.",
      supportButton: "Comprar um Café",
      rights: "Todos os direitos reservados. Feito para criadores.",
      privacyNote: "100% no navegador. Nenhum áudio é transmitido ou armazenado."
    }
  },
  de: {
    meta: {
      title: "SilenceRemover | Kostenloser Audio-Stille-Entferner (100% Privat)",
      description: "Entfernen Sie Stille, Pausen und Atemgeräusche aus Audiodateien blitzschnell im Browser. 100% kostenlos, privat und ohne Server-Uploads.",
      keywords: "stille aus audio entfernen, podcast pausen schneiden, audio trimmer kostenlos, web audio ohne server, stille remover"
    },
    nav: {
      features: "Funktionen",
      howItWorks: "Anleitung",
      faq: "FAQ",
      support: "Entwickler unterstützen",
      toggleTheme: "Design wechseln",
      selectLanguage: "Sprache"
    },
    hero: {
      badge: "100% Client-Side • Keine Server-Uploads • Höchster Datenschutz",
      title: "Stille aus Audio Entfernen",
      titleHighlight: "Sofort & 100% Privat",
      subtitle: "Schneiden Sie peinliche Sprechpausen und Leerlauf aus Podcasts, Interviews und Sprachaufnahmen vollautomatisch direkt in Ihrem Browser."
    },
    tool: {
      dropTitle: "Audiodatei hierher ziehen & ablegen",
      dropSubtitle: "oder klicken zum Auswählen (MP3, WAV, M4A, AAC, OGG, FLAC unterstützt)",
      fileLoaded: "Datei geladen",
      changeFile: "Andere Datei wählen",
      settingsTitle: "Stille-Erkennungsparameter",
      presetLabel: "Voreinstellungen",
      presets: {
        podcast: "Podcast & Sprache",
        audiobook: "Hörbuch Sauber",
        aggressive: "Aggressiver Schnitt",
        gentle: "Sanft & Natürlich"
      },
      thresholdLabel: "Stille-Schwellenwert (dB)",
      thresholdHelp: "Töne unter diesem Dezibel-Pegel werden als Stille identifiziert.",
      minSilenceLabel: "Minimale Stilledauer",
      minSilenceHelp: "Pausen, die länger als dieser Wert sind, werden herausgeschnitten.",
      paddingLabel: "Sicherheitspuffer (Padding)",
      paddingHelp: "Fügt vor und nach Sprachsegmenten Millisekunden hinzu, um Wortenden zu schonen.",
      processButton: "Stille Jetzt Entfernen",
      processingButton: "Wellenform analysieren & zuschneiden...",
      reprocessButton: "Aktualisieren & Neu berechnen",
      resultsTitle: "Zusammenfassung",
      originalDuration: "Ursprüngliche Länge",
      trimmedDuration: "Gekürzte Länge",
      timeSaved: "Eingesparte Zeit",
      silenceRemoved: "Entfernte Stille",
      cutsRemoved: "Entfernte Pausen",
      previewTitle: "Interaktive Wellenform & Hörprobe",
      listenOriginal: "Originalton",
      listenTrimmed: "Gekürzter Ton",
      downloadWav: "Studio-WAV herunterladen (Verlustfrei)",
      downloadMp3: "MP3 herunterladen",
      encodingMp3: "MP3 im Browser encodieren...",
      audioPlayerHelp: "Klicken Sie auf die Wellenform zum Spulen. Vorher/Nachher-Vergleich unten hören.",
      waveformLegendAudible: "Aktive Stimme",
      waveformLegendSilent: "Entfernte Stille"
    },
    features: {
      heading: "Entwickelt für Tempo, Klangqualität und Datenschutz",
      subheading: "Alles, was Sie für dynamische und professionelle Sprachaufnahmen benötigen.",
      items: [
        {
          title: "100% Client-Side Verarbeitung",
          description: "Ihre Audiodateien verlassen niemals Ihren Computer. Die Berechnung erfolgt lokal über die Web Audio API."
        },
        {
          title: "Klickfreie Micro-Crossfades",
          description: "Keine digitalen Klicks oder Knackser dank automatischer Mikro-Überblendungen an jeder Schnittstelle."
        },
        {
          title: "Verlustfreie Studioqualität",
          description: "Exportieren Sie unverfälschtes 16-Bit PCM WAV oder MP3 in Sendequalität für Spotify und YouTube."
        },
        {
          title: "Interaktive Wellenform",
          description: "Prüfen Sie visuell jeden Schnitt vor dem Download und vergleichen Sie das Ergebnis im A/B-Player."
        },
        {
          title: "Keine Limits, kein Account",
          description: "Keine Abogebühren, keine Wasserzeichen und keine willkürlichen Dateigrößenbegrenzungen."
        },
        {
          title: "Universelle Formatunterstützung",
          description: "Unterstützt MP3, WAV, M4A, AAC, OGG und FLAC nativ ohne zusätzliche Software."
        }
      ]
    },
    howItWorks: {
      heading: "So funktioniert SilenceRemover in 3 Schritten",
      subheading: "Schneller, präziser und vollautomatischer Audio-Schnitt.",
      steps: [
        {
          step: "01",
          title: "Audio Hochladen",
          description: "Ziehen Sie Ihre Datei in das Feld. Sie wird lokal in den Arbeitsspeicher decodiert."
        },
        {
          step: "02",
          title: "Parameter Wählen",
          description: "Wählen Sie ein Profil oder passen Sie Schwellenwert und Pausendauer individuell an."
        },
        {
          step: "03",
          title: "Anhören & Herunterladen",
          description: "Begutachten Sie das Resultat im Player und laden Sie Ihre bereinigte Datei als WAV oder MP3 herunter."
        }
      ]
    },
    privacy: {
      heading: "Datenschutz-Garantie ohne Server",
      description: "Im Gegensatz zu vielen Online-Tools lädt SilenceRemover keine Daten auf fremde Cloud-Server hoch.",
      bullet1: "Ihre Sprachaufnahmen bleiben ausschließlich auf Ihrem Gerät.",
      bullet2: "Keine Logs, kein Cloud-Speicher, kein Audio-Tracking.",
      bullet3: "Funktioniert nach dem Laden der Seite komplett offline."
    },
    faq: {
      heading: "Häufig Gestellte Fragen",
      subheading: "Wichtige Informationen zu SilenceRemover.",
      items: [
        {
          question: "Ist SilenceRemover wirklich kostenlos und sicher?",
          answer: "Ja, zu 100%! Alle Berechnungen laufen über die Web Audio API Ihres Browsers. Es findet keinerlei Datenübertragung statt."
        },
        {
          question: "Welche Dateiformate werden unterstützt?",
          answer: "Sie können MP3, WAV, M4A, AAC, OGG, FLAC und WebM einlesen und als 16-Bit Studio-WAV oder MP3 exportieren."
        },
        {
          question: "Welche Einstellungen eignen sich für Podcasts?",
          answer: "Ein Pegel von ca. -36 dB, eine Mindeststille von 300ms und ein Puffer von 40ms bieten meist das perfekte Ergebnis."
        },
        {
          question: "Gibt es Knackgeräusche an den Schnittstellen?",
          answer: "Nein. SilenceRemover berechnet feine Micro-Crossfades, um digitale Schnittgeräusche komplett zu eliminieren."
        },
        {
          question: "Gibt es ein Limit bei der Dateilänge?",
          answer: "Das Limit bestimmt allein der freie Arbeitsspeicher Ihres Geräts. Stundelange Aufnahmen lassen sich problemlos kürzen."
        }
      ]
    },
    footer: {
      tagline: "Kostenloser, lokaler Audio-Stille-Entferner für Content Creator weltweit.",
      supportButton: "Kaffee spendieren",
      rights: "Alle Rechte vorbehalten. Entwickelt für Kreative.",
      privacyNote: "100% lokal im Browser. Es werden keine Audiodaten übertragen."
    }
  },
  fr: {
    meta: {
      title: "SilenceRemover | Suppresseur de Silences Audio Gratuit (100% Privé)",
      description: "Supprimez les silences, pauses gênantes et blancs sonores de vos fichiers audio directement dans votre navigateur. 100% gratuit, rapide et sans serveur.",
      keywords: "supprimer silence audio, couper pauses podcast, silence remover gratuit, éditeur audio local navigateur, audio trimmer sans serveur"
    },
    nav: {
      features: "Fonctionnalités",
      howItWorks: "Comment ça marche",
      faq: "FAQ",
      support: "Soutenir le Projet",
      toggleTheme: "Changer de thème",
      selectLanguage: "Langue"
    },
    hero: {
      badge: "100% Côté Client • Zéro Serveur • Confidentialité Totale",
      title: "Supprimez les Silences de vos Audios",
      titleHighlight: "Instantané & Privé",
      subtitle: "Coupez automatiquement les pauses, hésitations et silences de vos podcasts, voix off et interviews. Traité directement dans la mémoire de votre navigateur."
    },
    tool: {
      dropTitle: "Glissez-déposez votre fichier audio ici",
      dropSubtitle: "ou cliquez pour sélectionner (Compatible MP3, WAV, M4A, AAC, OGG, FLAC)",
      fileLoaded: "Fichier chargé",
      changeFile: "Changer de fichier",
      settingsTitle: "Paramètres de Détection des Silences",
      presetLabel: "Préréglages",
      presets: {
        podcast: "Podcast & Voix",
        audiobook: "Livre Audio Net",
        aggressive: "Coupe Rapide",
        gentle: "Doux & Naturel"
      },
      thresholdLabel: "Seuil de Silence (dB)",
      thresholdHelp: "Les sons sous ce niveau en décibels sont considérés comme des silences.",
      minSilenceLabel: "Durée Minimale du Silence",
      minSilenceHelp: "Les silences plus longs que cette durée seront supprimés.",
      paddingLabel: "Marge de Sécurité (Padding)",
      paddingHelp: "Ajoute une marge avant et après la parole pour préserver les fins de phrases.",
      processButton: "Supprimer les Silences",
      processingButton: "Analyse et Découpe en cours...",
      reprocessButton: "Mettre à jour et Recalculer",
      resultsTitle: "Bilan du Traitement",
      originalDuration: "Durée Initiale",
      trimmedDuration: "Durée Finale",
      timeSaved: "Temps Économisé",
      silenceRemoved: "Silence Retiré",
      cutsRemoved: "Passages Coupés",
      previewTitle: "Forme d'Onde Interactive & Écoute",
      listenOriginal: "Audio Original",
      listenTrimmed: "Audio Raccourci",
      downloadWav: "Télécharger WAV Studio (Sans Perte)",
      downloadMp3: "Télécharger MP3",
      encodingMp3: "Encodage MP3 dans le navigateur...",
      audioPlayerHelp: "Cliquez sur la forme d'onde pour naviguer. Comparez l'original et le résultat ci-dessous.",
      waveformLegendAudible: "Parole Active",
      waveformLegendSilent: "Silence Supprimé"
    },
    features: {
      heading: "Conçu pour la Rapidité, la Qualité et la Confidentialité",
      subheading: "Tous les outils indispensables pour créer un son dynamique et professionnel.",
      items: [
        {
          title: "Traitement 100% Côté Client",
          description: "Vos fichiers audio ne sont jamais envoyés sur un serveur distant. Tout s'exécute grâce à l'API Web Audio."
        },
        {
          title: "Micro-Fondus Anti-Bruit",
          description: "Élimine les craquements et clics parasites grâce à des fondus enchaînés précis à chaque coupure."
        },
        {
          title: "Qualité Studio Sans Perte",
          description: "Exportez en WAV PCM 16 bits non compressé ou en MP3 haute fidélité pour vos diffusions."
        },
        {
          title: "Visualisation Graphique Interactive",
          description: "Vérifiez visuellement chaque coupure avant de télécharger et écoutez le comparatif avant/après."
        },
        {
          title: "Sans Inscription ni Limite",
          description: "Aucun abonnement, aucun filigrane et aucune restriction arbitraire de taille de fichier."
        },
        {
          title: "Compatibilité Universelle",
          description: "Prend en charge MP3, WAV, M4A, AAC, OGG et FLAC nativement dans votre navigateur."
        }
      ]
    },
    howItWorks: {
      heading: "Comment Fonctionne SilenceRemover en 3 Étapes",
      subheading: "Suppression des silences rapide, précise et automatique.",
      steps: [
        {
          step: "01",
          title: "Importez votre Audio",
          description: "Glissez votre fichier dans la zone prévue. Il est décodé directement dans la mémoire locale."
        },
        {
          step: "02",
          title: "Ajustez la Détection",
          description: "Sélectionnez un profil ou réglez le seuil de décibels et la durée de silence à votre convenance."
        },
        {
          step: "03",
          title: "Écoutez et Téléchargez",
          description: "Vérifiez le résultat sur la forme d'onde et téléchargez votre audio prêt à l'emploi en WAV ou MP3."
        }
      ]
    },
    privacy: {
      heading: "Garantie de Confidentialité Zéro Serveur",
      description: "Contrairement aux plateformes en ligne qui téléversent vos voix sur le cloud, SilenceRemover s'exécute sur votre appareil.",
      bullet1: "Vos fichiers ne quittent jamais votre ordinateur ou smartphone.",
      bullet2: "Aucun journal, aucun stockage dans le cloud, aucun pistage audio.",
      bullet3: "Fonctionne parfaitement même hors ligne une fois la page ouverte."
    },
    faq: {
      heading: "Foire Aux Questions",
      subheading: "Tout ce que vous devez savoir sur SilenceRemover.",
      items: [
        {
          question: "SilenceRemover est-il réellement gratuit et privé ?",
          answer: "Oui, totalement ! L'application fonctionne avec l'API Web Audio de votre navigateur. Vos données vocales ne transitent jamais sur internet."
        },
        {
          question: "Quels formats de fichiers sont acceptés ?",
          answer: "MP3, WAV, M4A, AAC, OGG, FLAC et WebM. Vous pouvez exporter en WAV studio 16 bits sans perte ou en MP3 optimisé."
        },
        {
          question: "Quels réglages choisir pour un podcast ?",
          answer: "Un seuil de -36 dB, une durée minimale de silence de 300ms et une marge de sécurité de 40ms donnent d'excellents résultats sans hachage."
        },
        {
          question: "Y a-t-il des bruits de clic aux coupures ?",
          answer: "Non. SilenceRemover applique des micro-fondus enchaînés à chaque raccord pour garantir une écoute fluide."
        },
        {
          question: "Quelle est la taille maximale de fichier ?",
          answer: "La seule limite est la mémoire vive de votre appareil. Vous pouvez traiter sans souci des enregistrements de plusieurs heures."
        }
      ]
    },
    footer: {
      tagline: "Suppresseur de silences audio gratuit et local pour les créateurs du monde entier.",
      supportButton: "Offrir un Café",
      rights: "Tous droits réservés. Conçu pour les créateurs.",
      privacyNote: "100% dans le navigateur. Aucun fichier n'est transmis ou conservé."
    }
  },
  ja: {
    meta: {
      title: "SilenceRemover | 無料のローカル音声無音カットツール (100% プライベート)",
      description: "ブラウザ内で音声ファイルの無音や不自然な間を自動検出して一瞬でカット。100%無料・完全プライベート・サーバー送信なし。",
      keywords: "無音カット, 音声 無音 削除, ポッドキャスト 間 カット, 無料 音声トリマー, ブラウザ 音声編集"
    },
    nav: {
      features: "機能紹介",
      howItWorks: "使い方",
      faq: "よくある質問",
      support: "開発者を支援",
      toggleTheme: "テーマ切替",
      selectLanguage: "言語"
    },
    hero: {
      badge: "100% クライアント処理 • サーバー送信ゼロ • 完全なプライバシー保護",
      title: "音声の無音区間を自動カット",
      titleHighlight: "即座に、そして安全に",
      subtitle: "ポッドキャスト、録音インタビュー、ナレーションの無音や長い間を自動でトリミング。すべての処理はブラウザのメモリ内だけで完結します。"
    },
    tool: {
      dropTitle: "ここに音声ファイルをドラッグ＆ドロップ",
      dropSubtitle: "またはクリックして選択（MP3, WAV, M4A, AAC, OGG, FLAC対応）",
      fileLoaded: "ファイル読み込み完了",
      changeFile: "別のファイルを選択",
      settingsTitle: "無音検出パラメータ設定",
      presetLabel: "プリセット",
      presets: {
        podcast: "ポッドキャスト・会話",
        audiobook: "オーディオブック明瞭",
        aggressive: "強めカット（テンポ重視）",
        gentle: "自然・マイルド"
      },
      thresholdLabel: "無音しきい値 (dB)",
      thresholdHelp: "このデシベル値より小さな音を「無音」として判定します。",
      minSilenceLabel: "最小無音継続時間 (ms)",
      minSilenceHelp: "このミリ秒以上続く無音区間をカットします。",
      paddingLabel: "セーフティパディング (余白)",
      paddingHelp: "発声の前後に追加する余白。言葉の末尾が途切れるのを防ぎます。",
      processButton: "無音をカットする",
      processingButton: "波形を分析してカット中...",
      reprocessButton: "設定を更新して再カット",
      resultsTitle: "トリミング結果",
      originalDuration: "元の長さ",
      trimmedDuration: "カット後の長さ",
      timeSaved: "削減された時間",
      silenceRemoved: "カットされた無音",
      cutsRemoved: "カット箇所数",
      previewTitle: "インタラクティブ波形＆試聴",
      listenOriginal: "元の音声",
      listenTrimmed: "カット後の音声",
      downloadWav: "スタジオ品質WAVを保存 (非圧縮)",
      downloadMp3: "MP3を保存",
      encodingMp3: "ブラウザ内でMP3にエンコード中...",
      audioPlayerHelp: "波形をクリックして再生位置を移動できます。元の音声と聴き比べてみましょう。",
      waveformLegendAudible: "発声区間",
      waveformLegendSilent: "カットされた無音区間"
    },
    features: {
      heading: "高速処理・高音質・確実なプライバシーのために設計",
      subheading: "プロ品質のテンポ良い音声編集を、わずか数秒で実現します。",
      items: [
        {
          title: "100% ブラウザ内クライアント処理",
          description: "音声データが外部サーバーに送信されることは一切ありません。お使いの端末のWeb Audio APIで処理されます。"
        },
        {
          title: "クリックノイズを防ぐマイクロクロスフェード",
          description: "カット接合部で発生しやすい「プチッ」というノイズを自動クロスフェード処理で完全に防ぎます。"
        },
        {
          title: "劣化なしのスタジオ品質出力",
          description: "16-bit リニアPCM WAV（非圧縮）および高音質MP3として直接ダウンロードできます。"
        },
        {
          title: "インタラクティブな波形ビジュアライザ",
          description: "どの部分が無音としてカットされたのかを一目で確認可能。カット前後を瞬時に切り替えて試聴できます。"
        },
        {
          title: "利用制限・会員登録なし",
          description: "ウォーターマーク（透かし）やファイルサイズ制限はありません。どなたでも完全無料でご利用いただけます。"
        },
        {
          title: "幅広い主要フォーマットに対応",
          description: "MP3、WAV、M4A、AAC、OGG、FLACなど主要な音声形式を標準コーデックで自動変換します。"
        }
      ]
    },
    howItWorks: {
      heading: "簡単3ステップで無音をカット",
      subheading: "初心者でも直感的に、精度の高い音声トリミングが可能です。",
      steps: [
        {
          step: "01",
          title: "音声を読み込む",
          description: "ファイルをドラッグ＆ドロップ。ブラウザのローカルメモリ上に直接読み込まれます。"
        },
        {
          step: "02",
          title: "設定を調整する",
          description: "用途に合わせたプリセットを選ぶか、デシベルスライダーを動かして検出感度を設定します。"
        },
        {
          step: "03",
          title: "試聴してダウンロード",
          description: "波形上で結果を確認し、元の音声と比較試聴したら、WAVまたはMP3形式で保存します。"
        }
      ]
    },
    privacy: {
      heading: "サーバー不要の完全プライバシー保証",
      description: "音声をクラウドにアップロードする他のオンラインツールと異なり、SilenceRemoverはお手元のブラウザ内でのみ動作します。",
      bullet1: "音声データがお使いのPCやスマートフォンから外部へ送信されることはありません。",
      bullet2: "ログ記録、クラウド保存、音声解析データのトラッキングは一切ありません。",
      bullet3: "ページを一度開けば、オフライン環境でも動作します。"
    },
    faq: {
      heading: "よくあるご質問 (FAQ)",
      subheading: "SilenceRemoverに関する疑問にお答えします。",
      items: [
        {
          question: "本当に完全無料で安全に使えますか？",
          answer: "はい、完全無料かつ安全です。ブラウザ標準のWeb Audio APIを活用しているため、音声ファイルがインターネット上を流れる心配はありません。"
        },
        {
          question: "対応している音声フォーマットは？",
          answer: "MP3、WAV、M4A、AAC、OGG、FLAC、WebMに対応しています。出力はスタジオ品質WAVおよびMP3から選べます。"
        },
        {
          question: "ポッドキャストのおすすめ設定は？",
          answer: "しきい値「-36 dB」、最小無音時間「300ms」、パディング「40ms」が標準的な会話音声に最も自然な仕上がりとなります。"
        },
        {
          question: "カット部分でノイズや音飛びは起きませんか？",
          answer: "各接合部に数ミリ秒のマイクロクロスフェードを適用するため、デジタルノイズや違和感のない滑らかな音声になります。"
        },
        {
          question: "音声の長さやファイルサイズに上限はありますか？",
          answer: "端末の利用可能なメモリ容量にのみ依存します。数時間の長尺ポッドキャストやオーディオブックも問題なく編集可能です。"
        }
      ]
    },
    footer: {
      tagline: "世界中のクリエイターのための、無料・ローカル音声無音カットツール。",
      supportButton: "コーヒーをおごる",
      rights: "All rights reserved. Built for creators.",
      privacyNote: "100% クライアント処理。音声データは一切収集・保存されません。"
    }
  }
};
