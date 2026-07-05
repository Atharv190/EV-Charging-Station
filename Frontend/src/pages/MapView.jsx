import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../api/api";

// ---------- Fix Leaflet marker icons ----------
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// ---------- Auto Fit Component ----------
function FitBounds({ stations }) {
    const map = useMap();

    useEffect(() => {
        if (stations.length === 0) return;

        // Only one station
        if (stations.length === 1) {
            map.setView(
                [stations[0].latitude, stations[0].longitude],
                13
            );
            return;
        }

        // Multiple stations
        const bounds = L.latLngBounds(
            stations.map((station) => [
                station.latitude,
                station.longitude,
            ])
        );

        map.fitBounds(bounds, {
            padding: [70, 70],
        });
    }, [stations, map]);

    return null;
}

function MapView() {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            const response = await api.get("/stations");

            console.log(response.data);

            setStations(response.data.stations);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-2xl font-semibold">
                Loading Map...
            </div>
        );
    }

    return (
        
    <div className="h-screen w-full relative">
        <div className="absolute top-4 left-4 z-[1000]">
        <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-100 transition"
        >
            <FiArrowLeft />
            Back to Dashboard
        </Link>
        </div>

        <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full"
        >
        <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds stations={stations} />

        {stations.map((station) => (
            <Marker
            key={station._id}
            position={[station.latitude, station.longitude]}
            >
            <Popup>
                <div
                style={{
                    minWidth: "220px",
                    lineHeight: "1.8",
                }}
                >
                <h2
                    style={{
                    marginBottom: "10px",
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "black",
                    }}
                >
                    ⚡ {station.name}
                </h2>

                <p>
                    📍 <strong>Location:</strong> {station.location}
                </p>

                <p>
                    🟢 <strong>Status:</strong> {station.status}
                </p>

                <p>
                    ⚡ <strong>Power:</strong> {station.powerOutput} kW
                </p>

                <p>
                    🔌 <strong>Connector:</strong> {station.connectorType}
                </p>
                </div>
            </Popup>
            </Marker>
        ))}
        </MapContainer>
    </div>
    );
}

export default MapView;