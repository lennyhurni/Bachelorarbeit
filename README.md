# Reflectify

Eine moderne Web-Applikation für reflektiertes Lernen mit KI-Unterstützung.

![Reflectify](https://img.shields.io/badge/Reflectify-v0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4)
![Supabase](https://img.shields.io/badge/Supabase-2.49.4-3ECF8E)
![OpenAI](https://img.shields.io/badge/OpenAI-4.96.1-412991)

## 🚀 Über das Projekt

Reflectify ist eine fortschrittliche Anwendung, die Lernenden hilft, ihre Reflexionsfähigkeiten zu vertiefen und ihr Lernen zu optimieren. Mit Hilfe von KI-gestützter Analyse werden Reflexionen bewertet und personalisierte Feedback gegeben, um den Reflexionsprozess kontinuierlich zu verbessern.

### 🔍 Hauptfunktionen

- **Reflexionsjournale**: Erstellen, bearbeiten und verwalten von strukturierten Reflexionen mit kategorisierbarer Ordnung und Suchfunktion
- **KI-gestützte Analyse**: Automatische Bewertung der Reflexionstiefe und -qualität anhand etablierter pädagogischer Kriterien
- **Dashboard**: Visualisierung der persönlichen Lernfortschritte und Reflexionsqualität mit interaktiven Grafiken
- **Personalisiertes Feedback**: Detaillierte Einsichten und Verbesserungsvorschläge auf Basis der individuellen Reflexionshistorie
- **Analytischer Rahmen**: Basierend auf etablierten Reflexionsmodellen wie Gibbs und Moon für strukturierte Reflexion
- **Lernziel-Tracking**: Setzen und Verfolgen von persönlichen Lernzielen mit Fortschrittsanzeigen
- **Adaptives Feedback-System**: Anpassung der Feedback-Tiefe je nach Benutzerpräferenz (Einfach, Standard, Detailliert)

## 📚 Projektstruktur

```
webapp/
│
├── src/
│   ├── app/                 # Next.js App Router Struktur
│   │   ├── api/             # API-Endpunkte
│   │   ├── auth/            # Authentifizierungs-Routen
│   │   ├── dashboard/       # Dashboard-Seite
│   │   ├── reflections/     # Reflexions-Verwaltung
│   │   ├── analytics/       # Analytik und Visualisierungen
│   │   ├── profile/         # Benutzerprofil
│   │   └── settings/        # Benutzereinstellungen
│   │
│   ├── components/          # Wiederverwendbare UI-Komponenten
│   │   ├── ui/              # Basis-UI-Komponenten (shadcn/ui)
│   │   └── ...              # Anwendungsspezifische Komponenten
│   │
│   ├── contexts/            # React Contexts für globalen State
│   ├── hooks/               # Custom React Hooks
│   ├── lib/                 # Bibliotheks-Helfer
│   └── utils/               # Utility-Funktionen
│
├── public/                  # Statische Assets
├── middleware.ts            # Next.js Middleware für Auth
├── next.config.js           # Next.js Konfiguration
└── package.json             # Projektabhängigkeiten
```

## 🛠️ Technologie-Stack

### Frontend
- **Next.js 15**: React-Framework mit fortschrittlichem App Router, Server-Side Rendering (SSR) und Server Components
  - Turbopack für beschleunigte Entwicklung
  - Optimiertes Code-Splitting und Bundle-Optimierung
  - Statische und dynamische Rendering-Strategien
- **React 19**: UI-Komponenten und Hooks für interaktive Benutzeroberfläche
  - Server Components für verbesserte Performance
  - React Server Actions für Formularverarbeitung
  - Suspense für verbesserte Ladezeiten
- **TypeScript**: Typsichere Entwicklung mit vollständiger Typabdeckung
  - Strikte Typisierung für robustere Anwendungen
  - Type-Guards und Zod für Runtime-Validation
- **TailwindCSS 4**: Utility-First CSS-Framework für responsive Designs
  - Custom Theme mit Corporate Identity
  - Dark Mode mit system preference sync
  - Animationen und Transitions
- **Shadcn/UI**: High-quality UI-Komponenten auf Basis von Radix UI
  - Vollständig barrierefreie Komponenten (ARIA-konform)
  - Anpassbare Theme-Variablen für konsistente Gestaltung
  - Umfangreiche Komponenten-Bibliothek (Dialoge, Popovers, Tooltips, Formulare)
- **Lucide Icons**: Moderne Icon-Bibliothek mit über 500 konsistenten Icons
- **Recharts**: Datenvisualisierung für das Dashboard mit responsiven Grafiken
  - Radar-Charts für KPI-Visualisierung
  - Line-Charts für zeitliche Entwicklung
  - Customizable Tooltips für detaillierte Informationen

### Backend & Infrastruktur
- **Supabase**: Backend-as-a-Service mit:
  - PostgreSQL Datenbank mit relationalen Daten und JSON-Unterstützung
  - Authentifizierung und Benutzerprofile mit mehreren Anmeldemethoden
  - Row-Level Security (RLS) für granulare Zugriffskontrollen auf Datenbankebene
  - Realtime-Subscriptions für sofortige UI-Updates
  - Storage für Mediendateien und Uploads
- **Next.js API Routes & Edge Functions**: Serverless-Funktionen für API-Endpunkte
  - Verarbeitung komplexer Logik serverless
  - Dedizierte Endpoints für Datenanalyse und KI-Interaktionen
  - Middleware für Authentifizierung und Ratenlimits
- **AI Integration**:
  - **OpenAI API**: Integration mit GPT-4 für fortschrittliche Textanalyse und Feedback-Generierung
    - Prompt-Engineering für präzise Reflexionsanalyse
    - Strukturierte JSON-Responses für KPI-Berechnungen
    - Fine-tuning für domänenspezifische Reflexionsanalyse
  - **Google Natural Language API**: Sentiment- und Entity-Analyse für zusätzliche Texteinsichten
    - Sprachunabhängige Textanalyse
    - Erkennung von Schlüsselkonzepten und Themen

### Datensicherheit & Performance
- **JWT-basierte Authentifizierung**: Sichere Sessions mit Supabase Auth
  - Automatische Token-Erneuerung
  - Secure HttpOnly Cookies
  - PKCE-Flow für erhöhte Sicherheit
- **Middleware-Schicht**: 
  - Routenschutz mit feingranularer URL-Pattern-Prüfung
  - Session-Management mit automatischer Verlängerung
  - Fehlerbehandlung und Fallback-Mechanismen
- **CORS & CSP**: Moderne Sicherheitsmaßnahmen gegen XSS und CSRF
- **Optimierte API-Performance**:
  - Caching-Strategien für häufig abgefragte Daten
  - Pagination für große Datensätze
  - Deduplizierte Anfragen auf Client-Seite

## 🧠 Implementierte Reflexionsmodelle

Die KI-Analyse basiert auf wissenschaftlichen Reflexionsmodellen:

### Moon's Reflexionsebenen
- **Beschreibend**: Einfache Wiedergabe von Erfahrungen ohne tiefere Analyse
- **Analytisch**: Untersuchung von Ursachen und Wirkungen mit ersten Einsichten
- **Kritisch**: Tiefgreifende Analyse mit Berücksichtigung verschiedener Perspektiven und Wertesysteme

### Feedback-Dimensionen
Die Analyse erfolgt anhand von vier Hauptdimensionen:
- **Tiefe (Depth)**: Grad der kritischen Auseinandersetzung mit dem Thema
- **Kohärenz (Coherence)**: Logische Struktur und Zusammenhang der Reflexion
- **Metakognition**: Bewusstsein über den eigenen Lernprozess
- **Umsetzbarkeit (Actionable)**: Praktische Anwendbarkeit der gezogenen Schlüsse

## 📱 Benutzeroberfläche & UX-Features

- **Adaptive Dashboard-Ansichten**: Verschiedene Darstellungsoptionen (Listen- und Kartenansicht)
- **Progressives Feedback-System**: Drei Stufen der Feedback-Tiefe (Einfach, Standard, Detailliert)
- **Transparente KI**: Erklärungen der KI-Funktionsweise und Analyse-Methodik
- **Reflexionsvorlagen**: Vordefinierte Strukturen für verschiedene Reflexionstypen
- **Smart-Filters**: Intelligente Filtermöglichkeiten für Reflexionen nach Kategorien, Datum und Qualität
- **Export-Funktionen**: Reflexionen als PDF oder Markdown exportieren
- **Dark/Light Mode**: Vollständige Unterstützung für beide Anzeigemodi mit System-Präferenz-Synchronisation
- **Barrierefreiheit**: WCAG 2.1 AA-konformes Interface mit Tastaturnavigation und Screenreader-Unterstützung
- **Toast-Benachrichtigungen**: Nicht-invasive Status-Updates für Benutzeraktionen

## 📊 Datenmodell

Das Hauptdatenmodell umfasst:

- **Users**: Benutzerprofile und Einstellungen
  - Authentifizierungsdaten (Email, Passwort-Hash)
  - Profildaten (Name, Avatar, Biografie)
  - Präferenzen (Theme, Sprache, Feedback-Tiefe)
  - Anmeldestatus und -historie
- **Reflections**: Reflexionsjournale mit Metadaten
  - Titel, Inhalt und Erstellungsdatum
  - Kategorie und Tags
  - KPI-Bewertungen (Tiefe, Kohärenz, Metakognition, Umsetzbarkeit)
  - KI-generiertes Feedback und Einsichten
  - Privat/Öffentlich-Status
- **LearningGoals**: Persönliche Lernziele und Fortschritte
  - Zielformulierung und Beschreibung
  - Start- und Zieldatum
  - Fortschrittsstatus und Meilensteine
  - Verbundene Reflexionen
- **Categories**: Kategorien für die Organisation von Reflexionen
  - Benutzerdefinierte Kategorien
  - System-Kategorien
- **Analytics**: Aggregierte Daten für Dashboard-Visualisierungen
  - Historische KPI-Entwicklung
  - Aktivitätsstatistiken
  - Trendanalysen

## 🧩 KI-Komponenten und Algorithmen

Reflectify nutzt mehrere KI-basierte Funktionen:

- **Reflexionsanalyse**: 
  - Automatische Bewertung der Reflexionstiefe mit linguistischer Analyse
  - Identifikation von Reflexionsebenen (nach Moon's Modell)
  - Mehrdimensionale KPI-Bewertung (Tiefe, Kohärenz, Metakognition, Handlungsorientierung)
  - Gewichtete Scoring-Algorithmen mit normalisierter Skalierung (0-10)

- **Prompt-Generierung**: 
  - Kontextbewusste Reflexionsanregungen basierend auf früheren Themen
  - Domänenspezifische Prompt-Templates für verschiedene Fachbereiche
  - Progression in Schwierigkeit basierend auf bisheriger Reflexionsqualität
  - Rotierendes System zur Vermeidung von Wiederholungen

- **Feedback-System**: 
  - Dreistufiges adaptives Feedback (Einfach, Standard, Detailliert)
  - Konkrete Verbesserungsvorschläge mit Textbeispielen
  - Positive Verstärkung erfolgreicher Reflexionselemente
  - Personalisierte Entwicklungspfade für langfristigen Fortschritt

- **Textanalyse**:
  - Sentiment-Analyse zur Erkennung emotionaler Tendenzen
  - Themen-Extraktion für konsistente Kategorisierung
  - Sprachniveau-Analyse für stilistische Feedback
  - Kohärenz-Prüfung mit semantischer Textanalyse


## 🧪 Entwicklung

- **Development Mode**: `npm run dev` mit Turbopack für schnelle Aktualisierungen
  - Hot Module Replacement für sofortige UI-Updates
  - Entwicklungsserver mit automatischer Typprüfung
- **Linting**: `npm run lint` für Code-Qualitätsprüfungen
  - ESLint mit Next.js Konfiguration
  - TypeScript strict mode
- **Produktion**: `npm run build` gefolgt von `npm start`
  - Optimierte Builds mit minimiertem JavaScript
  - Edge-optimierte Middleware

## 📄 Lizenz

© 2025 Lenny Hurni - Alle Rechte vorbehalten.

Diese Software ist urheberrechtlich geschützt. Jegliche Nutzung, Verteilung, Modifikation oder Weiterverbreitung ohne ausdrückliche schriftliche Genehmigung des Urhebers ist untersagt. Für Lizenzanfragen kontaktieren Sie bitte den Autor.

Entwickelt im Rahmen einer Bachelorarbeit an der Berner Fachhochschule.

---

&copy; 2025 Lenny Hurni