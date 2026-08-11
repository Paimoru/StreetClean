/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Leaflet Map Engine
 * Manages festival hotspot markers, GPS pins, and custom Teal + Gold icons.
 */

class MapEngine {
  constructor() {
    this.maps = {};
    this.markers = {};
    // Center on Legazpi City / Peñaranda Park area
    this.defaultCenter = [13.1398, 123.7410];
    this.defaultZoom = 14;
  }

  // Create custom SVG markers for Leaflet
  createCustomIcon(status = 'open', bounty = '₱850') {
    const isGold = status === 'open';
    const isTeal = status === 'in_progress';
    const isAmber = status === 'in_review';
    const isGreen = status === 'completed';

    let bgColor = '#f59e0b';
    let iconClass = 'fa-fire-flame-curved';

    if (isTeal) { bgColor = '#0ea5e9'; iconClass = 'fa-broom'; }
    else if (isAmber) { bgColor = '#f97316'; iconClass = 'fa-magnifying-glass'; }
    else if (isGreen) { bgColor = '#10b981'; iconClass = 'fa-check'; }

    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="
          background: ${bgColor};
          color: #042f2e;
          font-weight: 800;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 20px;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          cursor: pointer;
          transform: translate(-50%, -50%);
        ">
          <i class="fa-solid ${iconClass}" style="font-size: 10px;"></i>
          <span>${bounty}</span>
        </div>
      `,
      iconSize: [80, 30],
      iconAnchor: [40, 15]
    });
  }

  // Initialize commissions interactive map
  initCommissionsMap(containerId, commissions, onMarkerClick) {
    if (!document.getElementById(containerId)) return null;

    if (this.maps[containerId]) {
      this.maps[containerId].remove();
    }

    const map = L.map(containerId, {
      zoomControl: true,
      attributionControl: false
    }).setView(this.defaultCenter, this.defaultZoom);

    // Dark cartographic tiles tailored for Legazpi City
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    this.maps[containerId] = map;
    this.markers[containerId] = [];

    commissions.forEach(comm => {
      if (comm.lat && comm.lng) {
        const marker = L.marker([comm.lat, comm.lng], {
          icon: this.createCustomIcon(comm.status, `₱${comm.rewardPhp}`)
        }).addTo(map);

        marker.on('click', () => {
          if (onMarkerClick) onMarkerClick(comm);
        });

        // Popup snippet
        const popupContent = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #042f2e; padding: 4px; min-width: 180px;">
            <div style="font-weight: 800; font-size: 13px; margin-bottom: 4px;">${comm.title}</div>
            <div style="font-size: 11px; color: #0f766e; margin-bottom: 6px;"><i class="fa-solid fa-location-dot"></i> ${comm.sector}</div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 800; color: #b45309; font-family: monospace; font-size: 13px;">₱${comm.rewardPhp}</span>
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; background: #ccfbf1; color: #0f766e; padding: 2px 6px; border-radius: 4px;">${comm.status}</span>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);
        this.markers[containerId].push(marker);
      }
    });

    setTimeout(() => map.invalidateSize(), 200);
    return map;
  }

  // Location picker map for creating new reports
  initPickerMap(containerId, initialLat, initialLng, onLocationChange) {
    if (!document.getElementById(containerId)) return null;

    if (this.maps[containerId]) {
      this.maps[containerId].remove();
    }

    const lat = initialLat || this.defaultCenter[0];
    const lng = initialLng || this.defaultCenter[1];

    const map = L.map(containerId, {
      zoomControl: true,
      attributionControl: false
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: 'picker-pin-icon',
      html: `
        <div style="
          width: 38px;
          height: 38px;
          border-radius: 50% 50% 50% 0;
          background: #f59e0b;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          border: 3px solid #ffffff;
        ">
          <i class="fa-solid fa-camera" style="transform: rotate(45deg); color: #042f2e; font-size: 14px;"></i>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38]
    });

    const marker = L.marker([lat, lng], {
      draggable: true,
      icon: pinIcon
    }).addTo(map);

    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      if (onLocationChange) onLocationChange(pos.lat, pos.lng);
    });

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      if (onLocationChange) onLocationChange(e.latlng.lat, e.latlng.lng);
    });

    this.maps[containerId] = map;
    setTimeout(() => map.invalidateSize(), 200);
    return map;
  }
}

window.mapEngine = new MapEngine();
