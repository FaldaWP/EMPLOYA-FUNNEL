# EMPLOYA – Bewerbungs-Funnel

Ein konversionsoptimierter, mehrstufiger Bewerbungs-Funnel für die Personaldienstleistung
**EMPLOYA** („Für eine gute Pflege"). Zielgruppe: Pflegefachkräfte, Gesundheits- &
Krankenpfleger:innen und Erzieher:innen (m/w/d) in Norddeutschland.

## Dateien

| Datei | Zweck |
|-------|-------|
| `index.html` | Komplette Landingpage inkl. Funnel-Formular |
| `styles.css` | Branding & Layout (Employa-Grün, responsive) |
| `script.js` | Funnel-Logik: Schritte, Auto-Advance, Validierung, Versand |
| `assets/employa_logo.svg` | Original-Logo von employa.org |

## Lokal ansehen

Einfach `index.html` im Browser öffnen – oder einen kleinen Server starten:

```bash
cd "Employa Funnel"
node .claude/server.js   # http://localhost:4321
```

## Der Funnel (7 Schritte)

Schnelle Tap-Fragen (springen automatisch weiter):

1. **Stelle** (Pflegefachkraft, Krankenpfleger:in, Altenpfleger:in, Erzieher:in …)
2. **Bereich** (Krankenhaus/Klinik, Altenpflege, ambulante Pflege, Kita/Erziehung …)
   – ersetzt die frühere Aufteilung „Krankenhaus vs. Pflege" durch **eine** Frage
3. **Berufserfahrung**
4. **Region / Niederlassung** (Hamburg, Bremen, Schleswig-Holstein, Rendsburg)
5. **Arbeitszeitmodell**
6. **Mobilität** (Bus/Bahn, Führerschein mit/ohne Auto)

Detailformular „Passt alles?" (Schritt 7) mit allen Feldern der alten Seite:

7. **Daten & Unterlagen**: Recap der Auswahl · Anrede · Vor-/Nachname · E-Mail ·
   Rufnummer · Eintrittstermin · Gehaltsvorstellung · Nachricht · Lebenslauf-Upload ·
   Qualifikationen-Upload · Datenschutz-Einwilligung → Erfolgsseite

Validiert werden: Anrede, Vorname, Nachname, E-Mail, Rufnummer und der Datenschutz-Haken.
Eintrittstermin, Gehalt, Nachricht und die Datei-Uploads sind optional (höhere Abschlussrate).

## Bewerbungen empfangen (Backend anbinden)

Aktuell werden Bewerbungen **lokal im Browser** (`localStorage`) gespeichert und in der
Konsole geloggt – es ist **noch kein Backend angebunden**. In `script.js` ist die Funktion
`submitBewerbung(payload)` der zentrale Einstiegspunkt.

> **Hinweis zu Datei-Uploads:** Lokal wird nur der **Dateiname** erfasst. Damit Lebenslauf
> und Qualifikationen wirklich hochgeladen werden, braucht es ein Backend, das
> `multipart/form-data` annimmt – dann statt JSON ein `FormData`-Objekt aus dem `<form>`
> posten und die `<input type="file">`-Felder mitsenden.

Optionen:

- **E-Mail-Dienst / Formular-Backend** (z. B. Formspree, Web3Forms, Brevo): `fetch`-POST
  auf den jeweiligen Endpoint einsetzen.
- **Eigenes Backend / CRM**: POST der JSON-Daten an die eigene API.
- **Schnellster Start ohne Server**: `submitBewerbung` durch einen `mailto:`-Versand an
  `hamburg@employa.org` ersetzen.

Beispiel (Formular-Backend):

```js
function submitBewerbung(payload) {
  return fetch('https://DEIN-ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => { if (!r.ok) throw new Error('Versand fehlgeschlagen'); });
}
```

## Hinweise / nächste Schritte

- **Impressum & Datenschutz** verlinken (Pflicht in Deutschland) – Platzhalter im Footer.
- Logo ist das öffentliche SVG von employa.org; bei Bedarf durch die offizielle Markendatei ersetzen.
- Testimonial ist exemplarisch – durch echtes Zitat/Foto ersetzen.
- Für Tracking ggf. Conversion-Pixel (Meta/Google) auf der Erfolgsseite (`showSuccess`) einbauen.
