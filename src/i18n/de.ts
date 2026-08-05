import type { ToolContent } from './types';

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'EML Viewer — .eml-E-Mails im Browser öffnen, kein Upload | runlocally',
    description:
      'Öffne eine gespeicherte .eml-E-Mail im Browser und lies Header, Text und Anhänge. Die Datei wird auf deinem Gerät gelesen und nie hochgeladen. Externe Bilder und Stile im Nachrichtentext werden nicht geladen. Japanische E-Mails in Shift_JIS und ISO-2022-JP werden korrekt dargestellt. Open Source, funktioniert offline.',
    ogTitle: 'EML Viewer — .eml-E-Mails im Browser öffnen, kein Upload',
    ogDescription:
      'Header, Text und Anhänge einer .eml-Datei direkt im Browser ansehen. Kein Upload, keine externen Verbindungen aus dem Nachrichtentext. Open Source, funktioniert offline.',
  },

  hero: {
    h1: 'EML Viewer',
    tagline:
      'Öffne eine gespeicherte .eml-E-Mail direkt im Browser und lies Header, Text und Anhänge. Ohne Upload.',
  },

  intro: {
    h2: '.eml-Dateien im Browser lesen',
    paras: [
      'Eine .eml-Datei ist eine einzelne, auf die Festplatte gespeicherte E-Mail — weitergeleitete Belege, eine Mitteilung aus der Personal- oder Rechtsabteilung, eine Rechnung. Dieses Tool öffnet sie und zeigt die Header (Von/An/Cc/Betreff/Datum), den Nachrichtentext und eine Liste der Anhänge, die du einzeln herunterladen kannst. Die Datei wird auf deinem Gerät gelesen und nirgendwohin gesendet.',
      'Sowohl reiner Text als auch HTML-Nachrichtentexte werden unterstützt. MIME-codierte Header und Zeichenkodierungen außerhalb von UTF-8 werden korrekt dekodiert — einschließlich Shift_JIS und ISO-2022-JP, mit denen viele japanische Mailsysteme bis heute kodieren.',
      'Unterstützt wird nur .eml (das RFC-822-Textformat, das die meisten Mail-Programme exportieren). Das .msg-Format von Outlook ist eine andere, binäre Struktur und wird hier nicht verarbeitet.',
    ],
  },

  privacy: {
    h2: 'Warum deine E-Mail auf dem Gerät bleibt',
    lead: 'Eine E-Mail ist private Korrespondenz. Privatsphäre ist hier strukturell, kein Versprechen — es gibt keinen Upload-Schritt, weil es keinen Server gibt, an den gesendet werden könnte:',
    points: [
      'Die Datei wird vollständig im Browser gelesen und verarbeitet.',
      'Der HTML-Text wird nach der Bereinigung in einem Sandbox-Frame mit deaktivierten Skripten dargestellt.',
      'Externe Bilder, Hintergrundbilder und Stylesheets, auf die im Nachrichtentext verwiesen wird, werden vor der Anzeige entfernt — auch Tracking-Pixel. Aus dem Nachrichtentext geht keine Verbindung nach außen.',
      'Die Seite wird als statische Dateien ausgeliefert und sendet keine Anfrage, die deine Daten enthält.',
      'Der Quellcode ist offen und für jeden einsehbar (MIT).',
      'Es funktioniert offline — nur möglich, weil nichts das Gerät verlässt.',
    ],
    note: 'Wer es selbst prüfen möchte: Öffne das Netzwerk-Panel deines Browsers, während du eine Datei öffnest — keine Anfrage überträgt Inhalte, und keine Anfrage geht für etwas hinaus, das im Nachrichtentext referenziert wird.',
    sourceLinkText: 'Quellcode ansehen.',
  },

  howto: {
    h2: 'So funktioniert es',
    steps: [
      {
        h3: 'Datei öffnen',
        p: 'Klicke, um eine .eml-Datei auszuwählen, oder ziehe sie irgendwo auf die Seite. Die Datei wird lokal gelesen.',
      },
      {
        h3: 'Nachricht lesen',
        p: 'Header, Text und Anhänge erscheinen sofort. Sind sowohl HTML als auch reiner Text vorhanden, kannst du zwischen beiden wechseln.',
      },
      {
        h3: 'Anhänge herunterladen',
        p: 'Jeder Anhang hat einen eigenen Download-Button, sodass du nur die benötigte Datei speichern kannst.',
      },
    ],
  },

  faqHeading: 'Häufige Fragen',
  faq: [
    {
      q: 'Wird meine E-Mail irgendwohin hochgeladen?',
      a: 'Nein. Die Datei wird vollständig im Browser gelesen und verarbeitet. Es gibt keine Serverkomponente, daher hat der Inhalt keinen Weg, dein Gerät zu verlassen. Der Quellcode ist offen; du kannst das im Netzwerk-Panel deines Browsers nachvollziehen.',
    },
    {
      q: 'Werden Bilder oder Tracker aus der Nachricht geladen?',
      a: 'Nein. Jedes Bild, jeder Hintergrund und jeder Stil im HTML-Text, der auf eine externe Adresse verweist, wird vor der Anzeige entfernt, und der Text wird in einem Sandbox-Frame mit deaktivierten Skripten dargestellt. Angezeigt werden nur Bilder, die direkt in die Nachricht eingebettet sind (Inline-Anhänge).',
    },
    {
      q: 'Werden japanische E-Mails korrekt dargestellt?',
      a: 'Ja. Header, die als MIME-codierte Wörter vorliegen (z. B. =?ISO-2022-JP?B?...?=), sowie Nachrichtentexte in Shift_JIS oder ISO-2022-JP werden korrekt dekodiert, statt als unleserliche Zeichen (Mojibake) angezeigt zu werden.',
    },
    {
      q: 'Werden .msg-Dateien unterstützt?',
      a: 'Nein, nur .eml. Das .msg-Format von Outlook ist eine andere, binäre Struktur (OLE/Compound File Binary) und wird von diesem Tool nicht unterstützt.',
    },
    {
      q: 'Kann ich die E-Mail bearbeiten oder beantworten?',
      a: 'Nein. Dies ist ein reiner Lese-Viewer für gespeicherte E-Mails; er bearbeitet, versendet oder verändert die Datei nicht.',
    },
    {
      q: 'Funktioniert es offline?',
      a: 'Ja. Es ist eine PWA. Nach dem ersten Besuch wird sie zwischengespeichert und lässt sich ohne Internetverbindung öffnen. Du kannst sie auch auf deinem Startbildschirm installieren.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '— kleine Tools, die lokal auf deinem Gerät laufen.',
    colophon:
      'Erstellt und gepflegt von Geppetto. Ein Teil des Codes entsteht mit KI-Unterstützung; Prüfung und Entscheidungen liegen beim Maintainer.',
    securityText: 'Sicherheit',
  },
};
