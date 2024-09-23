# GraphHopper Distance Extension for Idealista

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

1. **GraphHopper API Key**: Obtain an API key from [GraphHopper](https://www.graphhopper.com/) and enter it in the extension's settings.
2. **Install the Extension**: Load the extension into Chrome by enabling Developer Mode and selecting the "Load unpacked" option.
3. **Customize Origins**: Set your desired origin points through the extension's options page.

## Future Enhancements

- Customizable Distance Thresholds and Colors: Allow users to define their own time thresholds and choose custom colors for different distance ranges, providing more flexibility in how distance information is displayed.
- Support for other real estate platforms.
