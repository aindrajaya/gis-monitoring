<div align="center">
  <h1 align="center">GIS Water Level Monitoring</h1>
</div>

This project is a web-based GIS application for monitoring water levels. It uses React and Leaflet to display sensor data on a map.

## Run Locally

**Prerequisites:** [Node.js](https://nodejs.org/)

1.  Install dependencies:

    ```bash
    npm install
    ```

2.  Configure environment variables:

    Copy `.env.example` to `.env` and configure the API settings:

    ```bash
    cp .env.example .env
    ```

    Edit `.env` and set your API credentials:

    ```env
    VITE_API_BASE_URL=https://staging.kurmaspace.com/klhk/app/index.php/api/portal_v1
    VITE_API_KEY=your_api_key_here
    ```

    **Note:** To obtain an API key, contact the system administrator or refer to the API documentation.

3.  Run the development server:

    ```bash
    npm run dev
    ```

    The application will be available at [http://localhost:5173](http://localhost:5173) (or another port if 5173 is in use).

## Features

### Data Source Toggle

The application supports both mock data (for development) and live API data:

- **Mock Data Mode** (default): Uses generated test data for development and demonstration
- **Live API Mode**: Fetches real-time sensor data from the configured API endpoint

Switch between modes in the Settings tab of the sidebar.

### API Integration

When using live API mode, the application connects to the TMAT Portal V1 API to fetch:

- Company/organization data
- Site locations and information
- Device/sensor configurations
- Real-time water level measurements

You can filter data by company using the dropdown in the Settings panel.

### Data Browser

The Analytics tab provides dedicated pages to view and manage API data:

- **Companies (Daftar Perusahaan)**: Browse all companies, view details including address, city, province, and status
- **Sites (Lokasi)**: View all monitoring sites with their locations and associated companies
- **Devices (Perangkat)**: List all sensor devices with their IDs, types, locations, and status
- **Realtime Data**: View real-time sensor readings including water level, rainfall, soil moisture, temperature, and electrical conductivity

Each data browser supports:
- List view with summary information
- Detail view with complete data
- Refresh functionality to get latest data
- Error handling with retry option
- Status indicators (active/inactive)
- Google Maps integration for locations

### Real-time Monitoring

- Interactive map with sensor markers
- Color-coded status indicators (Safe, Warning, Alert, Critical)
- Detailed sensor information panels
- Time-based filtering
- Bilingual support (English/Indonesian)

## Project Structure

-   `components/`: React components for the UI
    -   `MapComponent.tsx`: Renders the map and sensor markers
    -   `Sidebar.tsx`: Main navigation with mapping and settings tabs
    -   `SettingsPanel.tsx`: Data source toggle and API configuration
    -   `DetailsPanel.tsx`: Sensor detail view
    -   `ControlPanel.tsx`: Map view controls
    -   `TimeFilterPanel.tsx`: Time-based filtering
-   `context/`: React context providers
    -   `LanguageContext.tsx`: Internationalization (i18n) management
-   `data/`: Static data files
    -   `desaDayunBoundary.ts`: GeoJSON boundary for Desa Dayun area
-   `hooks/`: Custom React hooks
    -   `useSensorData.ts`: Main data provider with mock/live toggle
    -   `useApiData.ts`: API data fetching hooks (companies, sites, devices, realtime)
-   `services/`: Business logic and API integration
    -   `api.ts`: API client for TMAT Portal V1
    -   `dataAdapter.ts`: Maps API responses to application data format
-   `locales/`: Translation files
    -   `translations.ts`: English and Indonesian translations
-   `App.tsx`: Main application component
-   `index.tsx`: React application entry point
-   `vite.config.ts`: Vite build configuration
-   `package.json`: Project metadata and dependencies
-   `constants.ts`: Configuration constants (map settings, status colors, thresholds)
-   `types.ts`: TypeScript type definitions for sensor data and API responses
-   `.env.example`: Environment variable template
-   `.env`: Local environment configuration (not committed to git)

## Main Dependencies

-   [React](https://reactjs.org/): A JavaScript library for building user interfaces.
-   [Leaflet](https://leafletjs.com/): An open-source JavaScript library for mobile-friendly interactive maps.
-   [React-Leaflet](https://react-leaflet.js.org/): React components for Leaflet maps.
-   [D3-Delaunay](https://github.com/d3/d3-delaunay): A library for computing the Voronoi diagram of a set of two-dimensional points.
-   [GeoJSON](https://geojson.org/): A format for encoding a variety of geographic data structures.
-   [Vite](https://vitejs.dev/): A fast build tool for modern web projects.
-   [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.