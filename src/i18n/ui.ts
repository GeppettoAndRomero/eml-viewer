/**
 * Interactive-island strings, per locale. Separate from page-level content
 * (`en.ts` / `ja.ts` …): this is the text the Preact islands render.
 *
 * IMPORTANT: islands receive `locale` as a PROP (present during SSR) and never
 * read it from `document`. SSR and client render the same string, so there is no
 * hydration mismatch.
 *
 * Interpolated strings carry `{name}` templates; the island does `.replace('{name}', x)`.
 */
export const ui = {
  en: {
    // EmlViewer — open / dropzone
    uploadHeading: 'Open a file',
    uploadSubtitle: 'Choose a .eml file. It is read on your device.',
    dropClick: 'Click to choose a file',
    dropOr: 'or drop it anywhere on the page',
    dropSupported: 'Supported: .eml',

    // EmlViewer — message
    fromLabel: 'From',
    toLabel: 'To',
    ccLabel: 'Cc',
    dateLabel: 'Date',
    noSubject: '(no subject)',
    viewHtml: 'HTML',
    viewText: 'Plain text',
    bodyFrameTitle: 'Email message body',
    noBody: 'This email has no readable body.',
    remoteBlockedNote: 'Remote images and styles are never loaded — nothing in this message can call home.',
    attachmentsHeading: 'Attachments',
    download: 'Download',
    loadAnother: 'Open another file',

    // EmlViewer — error states
    errWrongType: '{name} is not a supported file. Choose a .eml file.',
    errEmpty: 'The file {name} is empty — there is nothing to show.',
    errUnreadable: 'The file {name} could not be read. Please try again.',
    errParse: 'The file {name} could not be read as an email. It may be corrupted or not a valid .eml file.',
    errConversionFailed: 'This file could not be opened.',
    errDownloadFailed: 'The attachment could not be downloaded.',

    // GlobalDropZone
    dzProcessing: 'Opening {count} file(s)…',
    dzPleaseWait: 'Please wait',
    dzDropTitle: 'Drop a file to view',
    dzDropSub: '.eml files can be viewed',

    // InstallPrompt
    installHeading: 'Install app',
    installBody: 'Add to your home screen for quick access.',
    install: 'Install',
    later: 'Later',

    // ThemeToggle
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    themeLabel: 'Theme',

    // shared
    required: 'Required',
    close: 'Close',
  },
  ja: {
    // EmlViewer — open / dropzone
    uploadHeading: 'ファイルを開く',
    uploadSubtitle: '.eml ファイルを選んでください。ファイルは端末内で読み込まれます。',
    dropClick: 'クリックしてファイルを選択',
    dropOr: 'またはページ上にドロップ',
    dropSupported: '対応形式: .eml',

    // EmlViewer — message
    fromLabel: '差出人',
    toLabel: '宛先',
    ccLabel: 'Cc',
    dateLabel: '日時',
    noSubject: '(件名なし)',
    viewHtml: 'HTML',
    viewText: 'プレーンテキスト',
    bodyFrameTitle: 'メール本文',
    noBody: 'このメールには表示できる本文がありません。',
    remoteBlockedNote: 'リモート画像やスタイルは一切読み込みません。本文から外部への通信は発生しません。',
    attachmentsHeading: '添付ファイル',
    download: 'ダウンロード',
    loadAnother: '別のファイルを開く',

    // EmlViewer — error states
    errWrongType: '{name} は対応していない形式です。.eml ファイルを選んでください。',
    errEmpty: 'ファイル {name} は空です。表示する内容がありません。',
    errUnreadable: 'ファイル {name} を読み込めませんでした。もう一度お試しください。',
    errParse:
      'ファイル {name} をメールとして読み込めませんでした。壊れているか、有効な .eml ファイルではない可能性があります。',
    errConversionFailed: 'このファイルを開けませんでした。',
    errDownloadFailed: '添付ファイルをダウンロードできませんでした。',

    // GlobalDropZone
    dzProcessing: '{count} 件のファイルを開いています…',
    dzPleaseWait: 'お待ちください',
    dzDropTitle: 'ドロップで表示',
    dzDropSub: '.eml ファイルを表示できます',

    // InstallPrompt
    installHeading: 'アプリを追加',
    installBody: 'ホーム画面に追加すると、すぐに開けます。',
    install: '追加',
    later: 'あとで',

    // ThemeToggle
    themeToLight: 'ライトモードに切り替え',
    themeToDark: 'ダークモードに切り替え',
    themeLabel: 'テーマ',

    // shared
    required: '必須',
    close: '閉じる',
  },
  zh: {
    // EmlViewer — open / dropzone
    uploadHeading: '打开文件',
    uploadSubtitle: '选择一个 .eml 文件。文件在你的设备上读取。',
    dropClick: '点击选择文件',
    dropOr: '或把文件拖到页面任意位置',
    dropSupported: '支持格式：.eml',

    // EmlViewer — message
    fromLabel: '发件人',
    toLabel: '收件人',
    ccLabel: '抄送',
    dateLabel: '日期',
    noSubject: '(无主题)',
    viewHtml: 'HTML',
    viewText: '纯文本',
    bodyFrameTitle: '邮件正文',
    noBody: '这封邮件没有可显示的正文。',
    remoteBlockedNote: '不会加载任何远程图片或样式——正文不会产生任何外部请求。',
    attachmentsHeading: '附件',
    download: '下载',
    loadAnother: '打开其他文件',

    // EmlViewer — error states
    errWrongType: '{name} 不是受支持的文件。请选择 .eml 文件。',
    errEmpty: '文件 {name} 为空，没有可显示的内容。',
    errUnreadable: '无法读取文件 {name}。请重试。',
    errParse: '无法将文件 {name} 解析为邮件。文件可能已损坏，或不是有效的 .eml 文件。',
    errConversionFailed: '无法打开此文件。',
    errDownloadFailed: '无法下载该附件。',

    // GlobalDropZone
    dzProcessing: '正在打开 {count} 个文件…',
    dzPleaseWait: '请稍候',
    dzDropTitle: '拖放即可查看',
    dzDropSub: '可以查看 .eml 文件',

    // InstallPrompt
    installHeading: '安装应用',
    installBody: '添加到主屏幕，方便随时打开。',
    install: '安装',
    later: '以后再说',

    // ThemeToggle
    themeToLight: '切换到浅色模式',
    themeToDark: '切换到深色模式',
    themeLabel: '主题',

    // shared
    required: '必填',
    close: '关闭',
  },
  de: {
    // EmlViewer — open / dropzone
    uploadHeading: 'Datei öffnen',
    uploadSubtitle: 'Wähle eine .eml-Datei. Sie wird auf deinem Gerät gelesen.',
    dropClick: 'Zum Auswählen klicken',
    dropOr: 'oder Datei irgendwo auf die Seite ziehen',
    dropSupported: 'Unterstützt: .eml',

    // EmlViewer — message
    fromLabel: 'Von',
    toLabel: 'An',
    ccLabel: 'Cc',
    dateLabel: 'Datum',
    noSubject: '(kein Betreff)',
    viewHtml: 'HTML',
    viewText: 'Nur Text',
    bodyFrameTitle: 'Nachrichtentext',
    noBody: 'Diese E-Mail hat keinen darstellbaren Nachrichtentext.',
    remoteBlockedNote:
      'Externe Bilder und Stile werden nie geladen — von der Nachricht geht keine Verbindung nach außen aus.',
    attachmentsHeading: 'Anhänge',
    download: 'Herunterladen',
    loadAnother: 'Andere Datei öffnen',

    // EmlViewer — error states
    errWrongType: '{name} ist kein unterstütztes Format. Wähle eine .eml-Datei.',
    errEmpty: 'Die Datei {name} ist leer – es gibt nichts anzuzeigen.',
    errUnreadable: 'Die Datei {name} konnte nicht gelesen werden. Bitte versuche es erneut.',
    errParse:
      'Die Datei {name} konnte nicht als E-Mail gelesen werden. Sie ist möglicherweise beschädigt oder keine gültige .eml-Datei.',
    errConversionFailed: 'Diese Datei konnte nicht geöffnet werden.',
    errDownloadFailed: 'Der Anhang konnte nicht heruntergeladen werden.',

    // GlobalDropZone
    dzProcessing: '{count} Datei(en) werden geöffnet …',
    dzPleaseWait: 'Bitte warten',
    dzDropTitle: 'Datei zum Ansehen ablegen',
    dzDropSub: '.eml-Dateien können angezeigt werden',

    // InstallPrompt
    installHeading: 'App installieren',
    installBody: 'Zum Startbildschirm hinzufügen, um es direkt zu öffnen.',
    install: 'Installieren',
    later: 'Später',

    // ThemeToggle
    themeToLight: 'Zum hellen Modus wechseln',
    themeToDark: 'Zum dunklen Modus wechseln',
    themeLabel: 'Design',

    // shared
    required: 'Erforderlich',
    close: 'Schließen',
  },
  es: {
    // EmlViewer — open / dropzone
    uploadHeading: 'Abrir un archivo',
    uploadSubtitle: 'Elige un archivo .eml. Se lee en tu dispositivo.',
    dropClick: 'Haz clic para elegir un archivo',
    dropOr: 'o suéltalo en cualquier parte de la página',
    dropSupported: 'Compatible: .eml',

    // EmlViewer — message
    fromLabel: 'De',
    toLabel: 'Para',
    ccLabel: 'Cc',
    dateLabel: 'Fecha',
    noSubject: '(sin asunto)',
    viewHtml: 'HTML',
    viewText: 'Texto sin formato',
    bodyFrameTitle: 'Cuerpo del mensaje',
    noBody: 'Este correo no tiene un cuerpo que se pueda mostrar.',
    remoteBlockedNote:
      'Nunca se cargan imágenes ni estilos remotos: el mensaje no genera ninguna conexión externa.',
    attachmentsHeading: 'Archivos adjuntos',
    download: 'Descargar',
    loadAnother: 'Abrir otro archivo',

    // EmlViewer — error states
    errWrongType: '{name} no es un archivo compatible. Elige un archivo .eml.',
    errEmpty: 'El archivo {name} está vacío: no hay nada que mostrar.',
    errUnreadable: 'No se pudo leer el archivo {name}. Inténtalo de nuevo.',
    errParse:
      'No se pudo leer el archivo {name} como correo. Puede estar dañado o no ser un archivo .eml válido.',
    errConversionFailed: 'No se pudo abrir este archivo.',
    errDownloadFailed: 'No se pudo descargar el archivo adjunto.',

    // GlobalDropZone
    dzProcessing: 'Abriendo {count} archivo(s)…',
    dzPleaseWait: 'Espera un momento',
    dzDropTitle: 'Suelta un archivo para verlo',
    dzDropSub: 'Se pueden ver archivos .eml',

    // InstallPrompt
    installHeading: 'Instalar la app',
    installBody: 'Añádela a tu pantalla de inicio para tenerla siempre a mano.',
    install: 'Instalar',
    later: 'Más tarde',

    // ThemeToggle
    themeToLight: 'Cambiar al modo claro',
    themeToDark: 'Cambiar al modo oscuro',
    themeLabel: 'Tema',

    // shared
    required: 'Obligatorio',
    close: 'Cerrar',
  },
} as const;

export type UiStrings = (typeof ui)['en'];
