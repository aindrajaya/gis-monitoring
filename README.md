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

2.  Run the development server:

    ```bash
    npm run dev
    ```

    The application will be available at [http://localhost:5173](http://localhost:5173) (or another port if 5173 is in use).

## Project Structure

-   `components/`: This directory contains the React components used in the application. `MapComponent.tsx` is responsible for rendering the map and the sensor data, while `ControlPanel.tsx` provides the user with a way to interact with the map.
-   `context/`: React context providers, such as `LanguageContext.tsx` for managing the application's language.
-   `data/`: This directory contains static data, such as the GeoJSON boundary file for the Desa Dayun area (`desaDayunBoundary.ts`).
-   `hooks/`: Custom React hooks, for example, `useSensorData.ts` to fetch and manage sensor data.
-   `locales/`: This directory contains translation files for internationalization (`translations.ts`).
-   `App.tsx`: The main application component, which brings together the map and the control panel.
-   `index.tsx`: The entry point of the React application, which renders the `App` component.
-   `vite.config.ts`: The configuration file for Vite, the build tool used in this project.
-   `package.json`: This file contains the project's metadata and a list of its dependencies.
-   `constants.ts`: This file contains configuration constants such as map center coordinates, zoom levels, status colors, and water level thresholds used in the application.
-   `types.ts`: This file contains the types for the sensor data used in the application.

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