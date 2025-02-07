import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HotelMap = ({ location }) => {
  const [latitude, longitude] = location?.split(",").map(Number); // Convert string to numbers

  return (
    <div>
      {latitude && longitude ? (
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[latitude, longitude]}>
            <Popup>Hotel Location</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default HotelMap;