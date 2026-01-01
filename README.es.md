# Accesos directos de página en blanco Extensión de Chrome

Una extensión de navegador Chrome rica en funciones que muestra accesos directos a sitios web visitados recientemente en la página de nueva pestaña, con soporte para formatos y cantidades de visualización personalizados.

## Características

- 🎯 **Accesos directos inteligentes**: Obtiene automáticamente sitios web visitados recientemente, deduplicados por dominio
- ⚙️ **Configuración flexible**: Soporte para personalizar la cantidad de visualización (10-50) y el formato (cuadrícula/lista/tarjeta)
- 🔍 **Búsqueda instantánea**: Cuadro de búsqueda integrado para filtrar y encontrar rápidamente accesos directos
- 📜 **Vista de historial**: Haga clic en un dominio para ver todas las páginas visitadas bajo ese sitio web
- 🎨 **Interfaz hermosa**: Diseño moderno con diseño responsivo
- 💾 **Configuración persistente**: La configuración se guarda automáticamente y se restaura en la próxima apertura
- 🔧 **Control dual**: Soporta tanto configuración en página como configuración de ventana emergente de extensión
- 🌐 **Iconos de sitio web**: Carga inteligente de favicon, soporta direcciones IP de red interna
- 🌍 **Soporte multilingüe**: Soporta chino, inglés, alemán, francés, español, japonés y coreano
- 📊 **Contador de páginas**: Muestra la cantidad de páginas históricas para cada dominio

## Instalación

1. Descargue o clone este proyecto en su máquina local
2. Abra el navegador Chrome y navegue a `chrome://extensions/`
3. Active el "Modo de desarrollador"
4. Haga clic en "Cargar extensión descomprimida"
5. Seleccione la carpeta del proyecto
6. Instalación de la extensión completada

## Guía de uso

### Uso básico
- Después de la instalación, abra una nueva pestaña para ver los accesos directos
- Haga clic en cualquier acceso directo para acceder directamente al sitio web correspondiente

### Configuración
1. **Configuración en página**: Haga clic en el botón ⚙️ en la esquina superior derecha
2. **Configuración de ventana emergente de extensión**: Haga clic en el icono de la extensión en la barra de herramientas del navegador

### Función de búsqueda
- Escriba palabras clave en el cuadro de búsqueda para filtrar accesos directos en tiempo real
- Soporta la búsqueda de títulos de sitio web y URL
- Presione Enter o simplemente comience a escribir para activar la búsqueda

### Vista de historial
- Haga clic en un dominio con múltiples páginas históricas para abrir un modal de historial
- El modal muestra todas las páginas visitadas bajo ese dominio (hasta 30)
- Muestra el título de la página, la ruta de URL y la hora de visita
- Soporta la tecla ESC o hacer clic fuera para cerrar el modal

### Opciones configurables
- **Cantidad de visualización**: 10, 20, 30, 40 o 50 elementos
- **Formato de visualización**:
  - Disposición de cuadrícula: Disposición en cuadrícula ordenada
  - Disposición de lista: Visualización de lista vertical
  - Disposición de tarjetas: Estilo de tarjeta grande
- **Iconos de sitio web**: Activar/desactivar visualización de favicon

## Estructura de archivos

```
blank-page-more-shortcuts/
├── manifest.json          # Archivo de configuración de extensión
├── newtab.html           # Nueva página HTML de pestaña
├── popup.html            # Ventana emergente HTML de extensión
├── styles/
│   ├── newtab.css        # Estilos de nueva página de pestaña
│   └── popup.css         # Estilos de ventana emergente
├── scripts/
│   ├── newtab.js         # Lógica de nueva página de pestaña
│   └── popup.js          # Lógica de ventana emergente
├── icons/                # Iconos de extensión (para agregar)
└── README.md             # Documentación
```

## Implementación técnica

### Tecnologías principales
- **Manifest V3**: Usa la última API de extensión de Chrome
- **Chrome Storage API**: Almacenamiento persistente para configuración de usuario
- **Chrome History API**: Acceso al historial del navegador
- **Chrome i18n API**: Soporte multilingüe
- **JavaScript moderno**: Sintaxis ES6+, diseño modular
- **Fetch API**: Soporta carga de iconos para IPs de red interna

### Módulos funcionales principales
1. **Gestión de configuración**: Cargar, guardar y sincronizar configuraciones de usuario
2. **Procesamiento de historial**: Obtener, filtrar y deduplicar sitios web visitados recientemente
3. **Gestión de historial de dominio**: Guardar lista de páginas históricas para cada dominio (hasta 30)
4. **Función de búsqueda**: Filtrado y búsqueda en tiempo real de accesos directos
5. **Sistema modal**: Mostrar páginas históricas bajo un dominio
6. **Sistema de carga de iconos**: Mecanismo de respaldo de múltiples niveles, soporta IPs internas y múltiples fuentes de iconos
7. **Renderizado UI**: Generar dinámicamente la interfaz de accesos directos según la configuración
8. **Manejo de eventos**: Interacción del usuario y actualizaciones de configuración

## Permisos

La extensión requiere los siguientes permisos:
- `storage`: Guardar configuración de usuario
- `tabs`: Acceder a información de pestañas
- `history`: Leer historial del navegador

## Desarrollo

### Desarrollo local
1. Después de hacer cambios en el código, haga clic en el botón de actualización en la página `chrome://extensions/`
2. Abra una nueva pestaña para ver los cambios

### Personalizar estilos
- Modifique `styles/newtab.css` para ajustar estilos de página
- Modifique `styles/popup.css` para ajustar estilos de ventana emergente

### Extender funciones
- Agregue nuevos módulos JavaScript en el directorio `scripts/`
- Modifique `manifest.json` para agregar permisos necesarios

## Notas

1. La extensión solo puede acceder al historial de páginas web regulares, no a páginas internas de Chrome
2. La obtención del historial está limitada a un máximo de 10,000 registros
3. Cada dominio guarda un máximo de 30 páginas históricas
4. Los iconos de sitio web se obtienen de múltiples servicios de terceros (Yandex, Google, DuckDuckGo)
5. Los iconos para IPs de red interna se obtienen mediante fetch y se convierten a dataURL, lo que puede afectar la velocidad de carga
6. Cuando falla la carga de iconos, se muestra un icono colorido basado en la primera letra como respaldo

## Información de versión

- **Versión**: 1.0.0
- **Compatibilidad**: Chrome 88+
- **Idiomas admitidos**: Chino (Simplificado), Inglés, Alemán, Francés, Español, Japonés, Coreano
- **Última actualización**: Enero 2026

## Licencia

Licencia MIT
