import { useEffect, useState } from "react";
import "./App.css";
// Import your Firebase config and initialize app
// Create a file src/firebaseConfig.js with your Firebase config and export 'db'
import { db } from "./firebaseConfig";
import { ref, onValue, set } from "firebase/database";

function App() {
  const [moisture, setMoisture] = useState(null);
  const [currentCrop, setCurrentCrop] = useState("");
  const [pumpStatus, setPumpStatus] = useState(false);
  const [crops, setCrops] = useState(["Wheat", "Rice", "Corn", "Tomato"]);

  // Listen for live updates from Firebase
  useEffect(() => {
    const moistureRef = ref(db, "moisture");
    const cropRef = ref(db, "currentCrop");
    const pumpRef = ref(db, "pumpStatus");

    const unsubMoisture = onValue(moistureRef, (snapshot) => {
      setMoisture(snapshot.val());
    });
    const unsubCrop = onValue(cropRef, (snapshot) => {
      setCurrentCrop(snapshot.val());
    });
    const unsubPump = onValue(pumpRef, (snapshot) => {
      setPumpStatus(snapshot.val());
    });

    return () => {
      unsubMoisture();
      unsubCrop();
      unsubPump();
    };
  }, []);

  // Change crop handler
  const handleCropChange = (e) => {
    set(ref(db, "currentCrop"), e.target.value);
  };

  // Manual pump toggle (optional)
  const togglePump = () => {
    set(ref(db, "pumpStatus"), !pumpStatus);
  };

  return (
    <div className="dashboard">
      <h1>Smart Irrigation Dashboard</h1>
      <div className="dashboard-section">
        <label>
          Select Crop:{" "}
          <select value={currentCrop} onChange={handleCropChange}>
            <option value="">--Select--</option>
            {crops.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="dashboard-section">
        <h2>Soil Moisture</h2>
        <div className="moisture-value">
          {moisture !== null ? `${moisture}%` : "Loading..."}
        </div>
      </div>
      <div className="dashboard-section">
        <h2>Water Pump</h2>
        <div className={`pump-status ${pumpStatus ? "on" : "off"}`}>
          {pumpStatus ? "ON" : "OFF"}
        </div>
        <button onClick={togglePump}>
          {pumpStatus ? "Turn OFF" : "Turn ON"}
        </button>
      </div>
    </div>
  );
}

export default App;
