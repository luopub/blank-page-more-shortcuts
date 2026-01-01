# Leere Seite Verknüpfungen Chrome-Erweiterung

Eine funktionsreiche Chrome-Browsererweiterung, die Verknüpfungen zu kürzlich besuchten Websites auf der neuen Registerkartenseite anzeigt, mit Unterstützung für benutzerdefinierte Anzeigeformate und -mengen.

## Funktionen

- 🎯 **Intelligente Verknüpfungen**: Ruft automatisch kürzlich besuchte Websites ab, nach Domain dedupliziert
- ⚙️ **Flexible Einstellungen**: Unterstützung für die Anpassung der Anzeigeanzahl (10-50) und des Formats (Raster/Liste/Karte)
- 🔍 **Sofortige Suche**: Integrierte Suchbox für schnelles Filtern und Finden von Verknüpfungen
- 📜 **Verlaufsansicht**: Klicken Sie auf eine Domain, um alle besuchten Seiten unter dieser Website anzuzeigen
- 🎨 **Schöne Benutzeroberfläche**: Modernes Design mit responsive Layout
- 💾 **Persistente Einstellungen**: Einstellungen werden automatisch gespeichert und beim nächsten Öffnen wiederhergestellt
- 🔧 **Doppelte Steuerung**: Unterstützt sowohl Seiteneinstellungen als auch Erweiterungs-Popup-Einstellungen
- 🌐 **Website-Symbole**: Intelligente Favicon-Ladung, unterstützt interne Netzwerk-IP-Adressen
- 🌍 **Mehrsprachige Unterstützung**: Unterstützt Chinesisch, Englisch, Deutsch, Französisch, Spanisch, Japanisch und Koreanisch
- 📊 **Seitenzahl**: Zeigt die Anzahl der Verlaufsseiten für jede Domain an

## Installation

1. Laden Sie dieses Projekt herunter oder klonen Sie es auf Ihren lokalen Computer
2. Öffnen Sie den Chrome-Browser und navigieren Sie zu `chrome://extensions/`
3. Aktivieren Sie den "Entwicklermodus"
4. Klicken Sie auf "Entpackte Erweiterung laden"
5. Wählen Sie den Projektordner aus
6. Installation der Erweiterung abgeschlossen

## Bedienungsanleitung

### Grundlegende Nutzung
- Nach der Installation öffnen Sie eine neue Registerkarte, um die Verknüpfungen zu sehen
- Klicken Sie auf eine Verknüpfung, um direkt auf die entsprechende Website zuzugreifen

### Einstellungen
1. **Seiteneinstellungen**: Klicken Sie auf die ⚙️-Schaltfläche in der oberen rechten Ecke
2. **Erweiterungs-Popup-Einstellungen**: Klicken Sie auf das Erweiterungssymbol in der Browser-Symbolleiste

### Suchfunktion
- Geben Sie Schlüsselwörter in das Suchfeld ein, um Verknüpfungen in Echtzeit zu filtern
- Unterstützt die Suche nach Website-Titeln und URLs
- Drücken Sie die Eingabetaste oder beginnen Sie einfach mit der Eingabe, um die Suche auszulösen

### Verlaufsansicht
- Klicken Sie auf eine Domain mit mehreren Verlaufsseiten, um ein Verlaufs-Modal zu öffnen
- Das Modal zeigt alle besuchten Seiten unter dieser Domain (bis zu 30)
- Zeigt Seitentitel, URL-Pfad und Besuchszeit
- Unterstützt ESC-Taste oder Klicken außerhalb zum Schließen des Modals

### Konfigurierbare Optionen
- **Anzeigeanzahl**: 10, 20, 30, 40 oder 50 Elemente
- **Anzeigeformat**:
  - Rasterlayout: Ordentliche Rasteranordnung
  - Listenlayout: Vertikale Listenanzeige
  - Kartenlayout: Großer Kartenstil
- **Website-Symbole**: Favicon-Anzeige aktivieren/deaktivieren

## Dateistruktur

```
blank-page-more-shortcuts/
├── manifest.json          # Erweiterungskonfigurationsdatei
├── newtab.html           # Neue Registerkartenseite HTML
├── popup.html            # Erweiterungs-Popup HTML
├── styles/
│   ├── newtab.css        # Neue Registerkartenseite Styles
│   └── popup.css         # Popup-Styles
├── scripts/
│   ├── newtab.js         # Neue Registerkartenseite Logik
│   └── popup.js          # Popup-Logik
├── icons/                # Erweiterungssymbole (hinzuzufügen)
└── README.md             # Dokumentation
```

## Technische Implementierung

### Kerntechnologien
- **Manifest V3**: Verwendet die neueste Chrome-Erweiterungs-API
- **Chrome Storage API**: Persistenter Speicher für Benutzereinstellungen
- **Chrome History API**: Zugriff auf Browserverlauf
- **Chrome i18n API**: Mehrsprachige Unterstützung
- **Modernes JavaScript**: ES6+ Syntax, modulares Design
- **Fetch API**: Unterstützt das Laden von Symbolen für interne Netzwerk-IPs

### Hauptfunktionale Module
1. **Einstellungsverwaltung**: Laden, Speichern und Synchronisieren von Benutzerkonfigurationen
2. **Verlaufsverarbeitung**: Abrufen, Filtern und Deduplizieren kürzlich besuchter Websites
3. **Domain-Verlaufsverwaltung**: Speichern der Liste der Verlaufsseiten für jede Domain (bis zu 30)
4. **Suchfunktion**: Echtzeit-Filterung und Suche von Verknüpfungen
5. **Modal-System**: Anzeige von Verlaufsseiten unter einer Domain
6. **Symbol-Ladesystem**: Multi-Level-Fallback-Mechanismus, unterstützt interne IPs und mehrere Symbolquellen
7. **UI-Rendering**: Dynamische Generierung der Verknüpfungsoberfläche basierend auf Einstellungen
8. **Ereignisbehandlung**: Benutzerinteraktion und Einstellungsaktualisierungen

## Berechtigungen

Die Erweiterung benötigt folgende Berechtigungen:
- `storage`: Benutzereinstellungen speichern
- `tabs`: Zugriff auf Registerkarteninformationen
- `history`: Browserverlauf lesen

## Entwicklung

### Lokale Entwicklung
1. Nach Änderungen am Code klicken Sie auf der Seite `chrome://extensions/` auf die Aktualisierungsschaltfläche
2. Öffnen Sie eine neue Registerkarte, um die Änderungen zu sehen

### Styles anpassen
- Ändern Sie `styles/newtab.css`, um die Seitenstile anzupassen
- Ändern Sie `styles/popup.css`, um die Popup-Stile anzupassen

### Funktionen erweitern
- Fügen Sie neue JavaScript-Module im `scripts/` Verzeichnis hinzu
- Ändern Sie `manifest.json`, um notwendige Berechtigungen hinzuzufügen

## Hinweise

1. Die Erweiterung kann nur auf den Verlauf regulärer Webseiten zugreifen, nicht auf Chrome-interne Seiten
2. Das Abrufen des Verlaufs ist auf maximal 10.000 Datensätze beschränkt
3. Jede Domain speichert maximal 30 Verlaufsseiten
4. Websitesymbole werden von mehreren Drittanbieterdiensten abgerufen (Yandex, Google, DuckDuckGo)
5. Symbole für interne Netzwerk-IPs werden über fetch abgerufen und in dataURL konvertiert, was die Ladegeschwindigkeit beeinträchtigen kann
6. Wenn das Laden von Symbolen fehlschlägt, wird ein buntes Symbol basierend auf dem ersten Buchstaben als Fallback angezeigt

## Versionsinformationen

- **Version**: 1.0.0
- **Kompatibilität**: Chrome 88+
- **Unterstützte Sprachen**: Chinesisch (Vereinfacht), Englisch, Deutsch, Französisch, Spanisch, Japanisch, Koreanisch
- **Zuletzt aktualisiert**: Januar 2026

## Lizenz

MIT-Lizenz
