# Unsere Hochzeitswebsite

## Lokal starten

```powershell
npm install
npm run setup:guest
npm run dev
```

Die Website und ihre API laufen gemeinsam im Vite-Entwicklungsserver. Öffne die
Adresse aus dem Terminal (normalerweise http://127.0.0.1:5173). Ein separater Server,
Vercel oder Redis sind lokal nicht erforderlich.

## Gästezugang

Dein festes Passwort steht in `.env.local` im Projektordner:

```dotenv
GUEST_PASSWORD="Dein selbst gewähltes Passwort"
```

12 bis 512 Zeichen verwenden. `npm run setup:guest` legt nur den internen zufälligen
Sitzungsschlüssel an. Es erzeugt kein Gästepasswort und überschreibt keine vorhandenen
Werte. `.env.local` wird nicht in Git aufgenommen. Nach Änderungen Vite neu starten.

Im Gästebereich anmelden, Galerie öffnen und mit „Abmelden“ wieder sperren.
Lokal werden Anmeldeversuche im Arbeitsspeicher begrenzt. Ein Serverneustart setzt
diesen Zähler zurück. Die Sitzung läuft nach acht Stunden ab.

## Dropbox-Dateianfrage

Die echte Anfrage bei Dropbox erstellen und den Link zusätzlich in `.env.local` setzen:

```dotenv
DROPBOX_FILE_REQUEST_URL=https://www.dropbox.com/request/DEINE_ANFRAGE_ID
```

Der Button erscheint nach Anmeldung. Ohne gültigen Link bleibt er deaktiviert.
Dropbox öffnet sich in einem neuen Tab; dafür ist eine Internetverbindung erforderlich.
Das Passwort der Dropbox-Dateianfrage direkt bei Dropbox einstellen: Der Website-
Login schützt keinen weitergegebenen Dropbox-Link. Neue Uploads bei Dropbox beenden,
indem du die Anfrage dort schließt.

## Aktueller Umfang

Navigation, Anmeldung, Sitzung, Galerieplatzhalter und Abmeldung funktionieren lokal.
Es gibt noch keine echten Galeriefotos und keine Bildspeicher-Anbindung. Private Bilder
nicht einfach nach `public/` legen: Sie wären dort ohne Anmeldung abrufbar.

`npm run build` erstellt die veröffentlichbare Website; `npm run lint` prüft den Code.
`npm run preview` zeigt nur den statischen Build und enthält die lokale Gäste-API nicht.
Zum vollständigen lokalen Ausprobieren deshalb `npm run dev` verwenden.

Auf Vercel werden die Server-Variablen separat eingetragen. Dort benötigt der
Login-Schutz weiterhin die Redis-Konfiguration aus `.env.example` und `APP_ORIGIN`.
