import { useState } from 'react';
import { Droplets, ThermometerSun, Leaf, CloudRain, MapPin, CloudLightning } from 'lucide-react';

const RecommendationForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    soil: { N: '', P: '', K: '', type: 'Black', pH: '6.5', moisture: 'Medium' },
    weather: { temperature: '28', humidity: '70', rainfall: '100' },
    water: { availability: 'Medium', pH: '7.0' },
    season: 'Kharif',
    location: { address: '', state: '', lat: null, lon: null }
  });

  const [locating, setLocating] = useState(false);
  const [fetchingWeather, setFetchingWeather] = useState(false);

  const handleChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
  };

  const getCurrentLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await res.json();
        
        handleLocationChange('lat', lat);
        handleLocationChange('lon', lon);
        handleLocationChange('address', data.display_name);
        handleLocationChange('state', data.address.state || data.address.region || '');
        
      } catch (e) {
        console.error('Failed to get address', e);
        alert('Could not resolve address. You can enter it manually.');
      }
      setLocating(false);
    }, () => {
      alert('Unable to retrieve your location');
      setLocating(false);
    });
  };

  const fetchWeather = async () => {
    if (!formData.location.lat || !formData.location.lon) {
      alert('Please detect your location first to fetch weather!');
      return;
    }
    setFetchingWeather(true);
    try {
      const { lat, lon } = formData.location;
      // Fetch current temp, average humidity and rainfall for the next few days
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=precipitation_sum&timezone=auto`);
      const data = await res.json();
      
      const temp = data.current_weather.temperature;
      // Approximate humidity if not available in current_weather, Open-Meteo gives temp directly
      // Fallback humidity to 65% for simplicity, or fetch from hourly
      const precipitation = data.daily.precipitation_sum[0] || 0; // Today's rain
      
      // Let's get more detailed weather
      const detailedRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation`);
      const detailedData = await detailedRes.json();
      
      const realTemp = detailedData.current.temperature_2m;
      const realHumidity = detailedData.current.relative_humidity_2m;
      // Average rainfall (this is current, so let's scale it slightly for monthly representation or use it directly)
      // Since it's point-in-time, we provide a reasonable estimate for rainfall if it's 0 currently
      const realRain = detailedData.current.precipitation > 0 ? detailedData.current.precipitation * 30 : formData.weather.rainfall; 

      handleChange('weather', 'temperature', Math.round(realTemp));
      handleChange('weather', 'humidity', Math.round(realHumidity));
      handleChange('weather', 'rainfall', Math.round(realRain > 0 ? realRain : 100)); // fallback to 100 if completely dry today
      
    } catch (e) {
      console.error('Weather fetch error', e);
      alert('Failed to fetch real-time weather. You can enter it manually.');
    }
    setFetchingWeather(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass-card animate-up">
      <h2 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2rem' }}>
        Farmer Input Details
      </h2>
      <form onSubmit={handleSubmit}>
        
        {/* Location Details */}
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: 'var(--secondary)' }}>
            <MapPin size={24} /> Farm Location (For Region-Based Crop AI)
          </h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: '1', minWidth: '300px' }}>
              <label>Address / Region</label>
              <textarea 
                className="input-control" 
                rows="2"
                placeholder="E.g. Pune, Maharashtra" 
                value={formData.location.address}
                onChange={(e) => handleLocationChange('address', e.target.value)}
              />
            </div>
            <div style={{ marginTop: '30px' }}>
              <button type="button" className="btn-secondary" onClick={getCurrentLocation} disabled={locating}>
                {locating ? 'Detecting...' : '📍 Auto-Detect Location'}
              </button>
            </div>
          </div>
        </div>

        {/* Soil Details */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: 'var(--primary-dark)' }}>
            <Leaf size={24} /> Soil Nutrients (NPK)
          </h3>
          <div className="grid-3">
            <div className="input-group">
              <label>Nitrogen (N)</label>
              <input type="number" className="input-control" placeholder="e.g. 90" required value={formData.soil.N} onChange={(e) => handleChange('soil', 'N', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Phosphorus (P)</label>
              <input type="number" className="input-control" placeholder="e.g. 42" required value={formData.soil.P} onChange={(e) => handleChange('soil', 'P', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Potassium (K)</label>
              <input type="number" className="input-control" placeholder="e.g. 43" required value={formData.soil.K} onChange={(e) => handleChange('soil', 'K', e.target.value)} />
            </div>
          </div>
          <div className="grid-3" style={{ marginTop: '1rem' }}>
            <div className="input-group">
              <label>Soil Type</label>
              <select className="input-control" value={formData.soil.type} onChange={(e) => handleChange('soil', 'type', e.target.value)}>
                <option value="Black">Black Soil</option>
                <option value="Red">Red Soil</option>
                <option value="Alluvial">Alluvial Soil</option>
                <option value="Laterite">Laterite Soil</option>
              </select>
            </div>
            <div className="input-group">
              <label>Soil pH</label>
              <input type="number" step="0.1" className="input-control" value={formData.soil.pH} onChange={(e) => handleChange('soil', 'pH', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Soil Moisture</label>
              <select className="input-control" value={formData.soil.moisture} onChange={(e) => handleChange('soil', 'moisture', e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#F59E0B', margin: 0 }}>
              <ThermometerSun size={24} /> Weather & Season
            </h3>
            <button type="button" className="btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '1rem', background: 'white', color: '#F59E0B', borderColor: '#F59E0B' }} onClick={fetchWeather} disabled={fetchingWeather}>
              <CloudLightning size={18} style={{ display: 'inline', marginRight: '5px' }} />
              {fetchingWeather ? 'Fetching...' : '🌤️ Auto-Fetch Weather'}
            </button>
          </div>
          
          <div className="grid-3">
             <div className="input-group">
              <label>Temperature (°C)</label>
              <input type="number" className="input-control" value={formData.weather.temperature} onChange={(e) => handleChange('weather', 'temperature', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Humidity (%)</label>
              <input type="number" className="input-control" value={formData.weather.humidity} onChange={(e) => handleChange('weather', 'humidity', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Season</label>
              <select className="input-control" value={formData.season} onChange={(e) => handleChange(null, 'season', e.target.value)}>
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Zaid">Zaid (Summer)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Water Details */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: 'var(--secondary)' }}>
            <Droplets size={24} /> Water Availability
          </h3>
          <div className="grid-3">
             <div className="input-group">
              <label>Rainfall Estimate (mm)</label>
              <div style={{ position: 'relative' }}>
                <CloudRain size={20} style={{ position: 'absolute', top: '15px', left: '15px', color: '#9CA3AF' }} />
                <input type="number" className="input-control" style={{ paddingLeft: '45px' }} value={formData.weather.rainfall} onChange={(e) => handleChange('weather', 'rainfall', e.target.value)} />
              </div>
            </div>
            <div className="input-group">
              <label>Water Access</label>
              <select className="input-control" value={formData.water.availability} onChange={(e) => handleChange('water', 'availability', e.target.value)}>
                <option value="Low">Low (Rainfed)</option>
                <option value="Medium">Medium (Canal/Well)</option>
                <option value="High">High (Abundant)</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Analyzing Data with AI...' : 'Predict Best Crops'}
        </button>
      </form>
    </div>
  );
};

export default RecommendationForm;
