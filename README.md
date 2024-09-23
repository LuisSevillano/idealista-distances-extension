# GraphHopper Distance Extension for Idealista

_[[Leer en español](#user-content-extensión-de-distancias-de-graphHopper-para-idealista)]_

This Google Chrome extension enhances the Idealista real estate website by providing the driving distance from two customizable origin points to each property listing. Using the GraphHopper API, the extension calculates the road distances and displays them in popups next to each listing, giving users quick access to distance information directly from the page. It works both in the listing view and the individual property detail pages, ensuring a seamless experience.

## Key Features

- **Customizable Origin Points**: Set primary and secondary origin locations manually or choose from a pre-defined list of cities (e.g., Madrid, Zaragoza, Donosti).
- **GraphHopper API Integration**: Automatically calculates road distances to each property based on user-defined coordinates.
- **Popups on Listings**: Displays non-intrusive popups with distance information on both the listing and detail pages.
- **Intersection Observer**: Only shows popups when the property listing is visible on the screen for improved performance and usability.
- **Chrome Storage Sync**: Saves API keys and city preferences locally so that they are persisted across sessions.
- **Distance-Based Color Coding**: Distances are color-coded for quick visual reference:
  - Distances greater than 3 hours are displayed in red.
  - Distances between 2 and 3 hours are displayed in orange.
  - Distances less than 2 hours are displayed in green.

## How It Works

1. **Configure Settings**: Enter your GraphHopper API key and set the coordinates for your desired origin points (primary and secondary if wanted) through the extension's options page.
2. **Automatic Distance Calculation**: When you browse Idealista listings, the extension automatically calculates the distance from both origin points to each property.
3. **Popup Display**: As you scroll through the listings, popups appear with the calculated distances next to each visible property.
4. **Detail Page Integration**: On individual property pages, a floating popup shows the distance to the selected origins.

## Setup

1. **Download the source code of the extension in the [releases](https://github.com/LuisSevillano/idealista-distances-extension/releases)** section. Unzip the zip file.
2. **Install the extension**: Load the extension in Chrome by activating Developer Mode and selecting the _Load without packaging_ option.
3. **GraphHopper API Key**: Get a free API key from [GraphHopper](https://www.graphhopper.com/) and enter it in the extension settings.
4. **Customise Sources**: Configure the desired source points via the extension's options page.

## Future Enhancements

- Customizable Distance Thresholds and Colors: Allow users to define their own time thresholds and choose custom colors for different distance ranges, providing more flexibility in how distance information is displayed.
- Support for other real estate platforms.

---

# Extensión de GoogleChrome para Idealista

Esta extensión para Google Chrome mejora la experiencia en la página web de Idealista el tiempo y la distancia de desplazamiento en coche desde un punto proporcionado por el usuario hasta el lugar donde se encuentra la propiedad del anuncio. Usando la API de GraphHopper, la extensión calcula las distancias por carretera y las integra en cada anuncio, ofreciendo a los usuarios acceso rápido a la información de distancia directamente desde la página. Funciona tanto en la vista de listado como en las páginas de detalles de las propiedades, asegurando una experiencia fluida.

## Características Principales

- **Puntos de Origen Personalizables**: Configura manualmente las ubicaciones de origen primarias y secundarias o elige de una lista predefinida de ciudades (por ejemplo, Madrid, Zaragoza, Donosti).
- **Integración con la API de GraphHopper**: Calcula automáticamente las distancias por carretera hasta cada propiedad en función de las coordenadas definidas por el usuario.
- **Popups en los Anuncios**: Muestra popups no intrusivos con información de distancia tanto en las páginas de listado como en las de detalle.
- **Observador de Intersección**: Solo muestra los popups cuando el anuncio de la propiedad es visible en la pantalla, mejorando el rendimiento y la usabilidad.
- **Sincronización en Chrome**: Guarda las claves API y las preferencias de las ciudades localmente para que se mantengan entre sesiones.
- **Codificación por Colores Basada en Distancias**: Las distancias se codifican por colores para una referencia visual rápida:
  - Las distancias superiores a 3 horas se muestran en rojo.
  - Las distancias entre 2 y 3 horas se muestran en naranja.
  - Las distancias inferiores a 2 horas se muestran en verde.

## Cómo Funciona

1. **Configurar Ajustes**: Ingresa tu clave API de GraphHopper y configura las coordenadas de los puntos de origen deseados (primario y secundario si lo deseas) a través de la página de opciones de la extensión.
2. **Cálculo Automático de Distancias**: Cuando navegas por los listados de Idealista, la extensión calcula automáticamente la distancia desde ambos puntos de origen hasta cada propiedad.
3. **Mostrar Popups**: A medida que te desplazas por los listados, los popups aparecen con las distancias calculadas al lado de cada propiedad visible.
4. **Integración en la Página de Detalles**: En las páginas de propiedades individuales, aparece un popup flotante que muestra la distancia a los orígenes seleccionados.

## Instalación

1. **Descarga el código fuente de la extensión en el apartado de [releases](https://github.com/LuisSevillano/idealista-distances-extension/releases)**. Selecciona la última _release_ disponible. Descomprime el zip.
2. **Instalar la Extensión**: Carga la extensión en Chrome activando el Modo Desarrollador y seleccionando la opción _Cargar sin empaquetar_.
3. **Clave API de GraphHopper**: Obtén una clave API gratuita de [GraphHopper](https://www.graphhopper.com/) e ingrésala en la configuración de la extensión.
4. **Personaliza los Orígenes**: Configura los puntos de origen deseados a través de la página de opciones de la extensión.

## Mejoras Futuras

- Umbrales de Distancia y Colores Personalizables: Permitir a los usuarios definir sus propios umbrales de tiempo y elegir colores personalizados para diferentes rangos de distancia, ofreciendo más flexibilidad en cómo se muestra la información de distancia.
- Soporte para otras plataformas inmobiliarias.
