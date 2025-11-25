Based on the analysis of the **SiPPEG "PETA INTERAKTIF"** (specifically the TMAT/Water Level module) and your current `gis-monitoring` app, here are the specific features you need to implement to match the government's water level monitoring capabilities.

### 1. Advanced Map Tools & Interactivity
Your current app has a basic "Time Filter," but the SiPPEG app uses a more structured "Period & Layer" approach.

*   **Biweekly Period Selector (TMAT Dwi Mingguan):**
    *   **Feature:** Instead of a generic date range, add a specific "Period Selector" for **Biweekly (2-week) snapshots**.
    *   **UI Implementation:** A dropdown menu with `Year` (e.g., 2025) and `Period` (e.g., "Oct I", "Oct II") selection.
    *   **Why:** Peatland management relies on 2-week trends rather than just instantaneous real-time values.
*   **Dynamic Risk Legend:**
    *   **Feature:** A collapsible legend box overlay that explains the color coding of the sensors.
    *   **Specific Thresholds (from SiPPEG):**
        *   <span style="color:blue">■</span> **Blue:** < 0.0m (WET - FLOODED)
        *   <span style="color:green">■</span> **Green:** 0.0m - 0.4m (Safe / Compliant)
        *   <span style="color:yellow">■</span> **Yellow:** 0.4m - 0.8m (Warning)
        *   <span style="color:red">■</span> **Red:** > 0.8m (Danger / Fire Risk)
*   **Layer Toggle Control:**
    *   **Feature:** A widget (top-left or top-right) to switch visual layers between "Real-time Water Level", "Biweekly Status", "Infrastructure/Canal Blocks", and "Emission Risk".

### 2. Biweekly Peat Surface Elevation (Water Level Case)
The government site calls this **"TMAT Dwi Mingguan"**.

*   **Data Aggregation:**
    *   Don't just show the *current* water level. Calculate the **Average Water Level** for the selected 2-week period (e.g., Oct 1-15).
*   **Visualization:**
    *   Render the sensor markers on the map as **colored circles** based on that 2-week average (using the legend colors above) rather than just generic pins.
    *   This gives an instant "health check" of the entire landscape for that period.

### 3. Track & Display Canal Block Stats (Infrastructure)
On SiPPEG, this is part of the "Neraca Air" (Water Balance) or infrastructure layers.

*   **Infrastructure Layer:**
    *   Add a new layer for **Water Control Structures** (Canal Blocks, Sluice Gates, Pumps).
    *   **Icons:** Use distinct icons (e.g., a square or gate icon) different from the sensor circles.
*   **Stats Popup:**
    *   When clicking a Canal Block icon, show a popup with:
        *   **Status:** Active / Damaged / Needs Maintenance.
        *   **Retention Effectiveness:** Comparison of water levels *upstream* vs. *downstream* (if sensors are nearby).

### 4. Emission Reductions (Water Level Case)
Peatland emissions are directly correlated to the water table depth (lower water = higher oxidation/emissions).

*   **Emission Risk Layer:**
    *   Create a "Computed Layer" that translates Water Level (WL) into Emission Risk.
    *   **Logic:**
        *   **Low Emission (Safe):** WL is 0cm to -40cm (Green).
        *   **Medium Emission:** WL is -40cm to -80cm (Yellow).
        *   **High Emission:** WL is < -80cm (Red).
*   **Analytics Dashboard (Analitik Tab):**
    *   Add a chart titled **"Estimated CO2 Reduction"**.
    *   **Formula:** *Estimated Reduction = (Baseline Emission - Current Emission)*.
    *   Baseline is usually assumed at a drained depth (e.g., -80cm). If you keep water at -30cm, you "reduce" emissions by the difference.

### Summary Checklist for Your App

| Feature | Action to Take on `gis-monitoring` |
| :--- | :--- |
| **Map Markers** | Change from generic pins to **Color-Coded Circles** based on risk thresholds (0.0, 0.4, 0.8m). |
| **Time Filter** | Add a **"Biweekly Snapshot" mode** (e.g., dropdown for "Oct Period II") that aggregates data. |
| **Legend** | Add a floating **Legend Widget** explaining the color codes (Flooded, Safe, Warning, Danger). |
| **Infrastructure** | Add a **"Canal Blocks" toggle layer** that shows gate/block locations and their operational status. |
| **Emissions** | Add a view that re-labels the Water Level colors as **"Emission Risk"** (Dry = High Emission). |