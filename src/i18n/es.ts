import type { ToolContent } from './types';

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'EML Viewer — Abre archivos de correo .eml en tu navegador, sin subirlos | runlocally',
    description:
      'Abre un archivo de correo .eml guardado en tu navegador y lee sus encabezados, cuerpo y archivos adjuntos. El archivo se lee en tu dispositivo y nunca se sube. Las imágenes y estilos remotos del cuerpo nunca se cargan. Muestra correctamente correos japoneses en Shift_JIS e ISO-2022-JP. Código abierto, funciona sin conexión.',
    ogTitle: 'EML Viewer — Abre archivos de correo .eml en tu navegador, sin subirlos',
    ogDescription:
      'Consulta encabezados, cuerpo y adjuntos de un archivo .eml directamente en tu navegador. Sin subida y sin conexiones externas desde el cuerpo del mensaje. Código abierto, funciona sin conexión.',
  },

  hero: {
    h1: 'EML Viewer',
    tagline:
      'Abre un archivo de correo .eml guardado y lee sus encabezados, cuerpo y adjuntos en tu navegador. Sin subirlo.',
  },

  intro: {
    h2: 'Leer un archivo .eml en tu navegador',
    paras: [
      'Un archivo .eml es un correo guardado tal cual en disco: pruebas reenviadas, un aviso de RR. HH. o legal, una factura. Esta herramienta lo abre y muestra los encabezados (De/Para/Cc/Asunto/Fecha), el cuerpo del mensaje y una lista de adjuntos que puedes descargar de uno en uno. El archivo se lee en tu dispositivo; nunca se envía a ningún sitio.',
      'Admite tanto el cuerpo en texto plano como en HTML, y decodifica correctamente los encabezados con palabras codificadas MIME y las codificaciones distintas de UTF-8 — incluidas Shift_JIS e ISO-2022-JP, con las que aún hoy codifican muchos sistemas de correo japoneses.',
      'Solo se admite .eml (el formato de texto RFC 822 que exportan la mayoría de los clientes de correo). El formato .msg de Outlook es una estructura binaria distinta y esta herramienta no lo procesa.',
    ],
  },

  privacy: {
    h2: 'Por qué tu correo se queda en tu dispositivo',
    lead: 'Un correo es correspondencia privada. Aquí la privacidad es estructural, no una promesa: no hay paso de subida porque no hay ningún servidor al que enviarlo:',
    points: [
      'El archivo se lee y procesa por completo en tu navegador.',
      'El cuerpo en HTML se muestra dentro de un marco aislado (sandbox) con los scripts desactivados, después de sanearlo.',
      'Las imágenes remotas, los fondos y las hojas de estilo referenciadas en el cuerpo se eliminan antes de mostrarlo, incluidos los píxeles de rastreo: el cuerpo del mensaje no genera ninguna conexión externa.',
      'La página se sirve como archivos estáticos y no envía ninguna solicitud que contenga tus datos.',
      'El código es abierto y cualquiera puede leerlo (MIT).',
      'Funciona sin conexión, algo posible solo porque nada sale del dispositivo.',
    ],
    note: 'Si quieres comprobarlo tú mismo, abre el panel de red de tu navegador mientras abres un archivo: ninguna solicitud transporta su contenido, ni se realiza ninguna solicitud por algo referenciado dentro del cuerpo del mensaje.',
    sourceLinkText: 'Ver el código fuente.',
  },

  howto: {
    h2: 'Cómo usarlo',
    steps: [
      {
        h3: 'Abre un archivo',
        p: 'Haz clic para elegir un archivo .eml, o suéltalo en cualquier parte de la página. El archivo se lee localmente.',
      },
      {
        h3: 'Lee el mensaje',
        p: 'Los encabezados, el cuerpo y los adjuntos aparecen de inmediato. Si existen versiones en HTML y en texto plano, puedes alternar entre ellas.',
      },
      {
        h3: 'Descarga los adjuntos',
        p: 'Cada adjunto tiene su propio botón de descarga, así que puedes guardar solo el archivo que necesitas.',
      },
    ],
  },

  faqHeading: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Se sube mi correo a algún sitio?',
      a: 'No. El archivo se lee y procesa por completo en tu navegador. No hay ningún componente de servidor, así que su contenido no tiene forma de salir de tu dispositivo. El código es abierto y puedes comprobarlo en el panel de red de tu navegador.',
    },
    {
      q: '¿Carga imágenes o rastreadores del mensaje?',
      a: 'No. Cualquier imagen, fondo o estilo del cuerpo en HTML que apunte a una ubicación remota se elimina antes de mostrar el mensaje, y el cuerpo se muestra en un marco aislado con los scripts desactivados. Solo se muestran las imágenes incrustadas directamente en el mensaje (adjuntos en línea).',
    },
    {
      q: '¿Muestra correctamente el correo en japonés?',
      a: 'Sí. Los encabezados codificados como palabras MIME (por ejemplo, =?ISO-2022-JP?B?...?=) y los cuerpos enviados en Shift_JIS o ISO-2022-JP se decodifican correctamente, en lugar de mostrarse como caracteres ilegibles.',
    },
    {
      q: '¿Es compatible con archivos .msg?',
      a: 'No, solo con .eml. El formato .msg de Outlook es una estructura binaria distinta (OLE/Compound File Binary) que esta herramienta no admite.',
    },
    {
      q: '¿Puedo editar o responder al correo?',
      a: 'No. Es un visor de solo lectura para consultar un correo guardado; no edita, envía ni modifica el archivo.',
    },
    {
      q: '¿Funciona sin conexión?',
      a: 'Sí. Es una PWA. Tras la primera visita queda en caché, así que se abre sin conexión a internet. También puedes instalarla en tu pantalla de inicio.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'parte de',
    brandTail: '— pequeñas herramientas que funcionan localmente en tu dispositivo.',
    colophon:
      'Creado y mantenido por Geppetto. Parte del código se escribe con ayuda de IA; la revisión y las decisiones son del responsable del proyecto.',
    securityText: 'Seguridad',
  },
};
