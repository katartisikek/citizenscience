import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const CRETE_CENTER = [35.2401, 24.8093];

const ObservationMap = ({ observations = [], projects = [] }) => {
  const markers = observations.filter(o => o.lat && o.lng && o.status === 'approved');

  return (
    <MapContainer
      center={CRETE_CENTER}
      zoom={8}
      style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-md)' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map(obs => {
        const project = projects.find(p => p.id === obs.project_id);
        return (
          <Marker key={obs.id} position={[obs.lat, obs.lng]}>
            <Popup>
              <strong>{project?.title || 'Παρατήρηση'}</strong>
              <br />
              {obs.created_at && new Date(obs.created_at).toLocaleDateString('el-GR')}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default ObservationMap;
