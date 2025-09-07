import { config } from '../lib/config';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodingResult {
  coordinates: Coordinates;
  placeName: string;
  country?: string;
  region?: string;
}

export class GeocodingService {
  static async geocodeDestination(destination: string): Promise<GeocodingResult | null> {
    try {
      // Try Google Maps Geocoding API first if available
      if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
        return new Promise((resolve) => {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode(
            { address: destination },
            (results, status) => {
              if (status === 'OK' && results && results[0]) {
                const result = results[0];
                const location = result.geometry.location;
                const latitude = location.lat();
                const longitude = location.lng();
                
                // Extract place information
                const placeName = result.formatted_address;
                let country = '';
                let region = '';
                
                result.address_components.forEach(component => {
                  if (component.types.includes('country')) {
                    country = component.long_name;
                  }
                  if (component.types.includes('administrative_area_level_1')) {
                    region = component.long_name;
                  }
                });
                
                resolve({
                  coordinates: { latitude, longitude },
                  placeName,
                  country,
                  region,
                });
              } else {
                console.warn('Google Geocoding failed, falling back to Nominatim');
                resolve(this.fallbackGeocode(destination));
              }
            }
          );
        });
      }
      
      // Fallback to Nominatim if Google Maps is not available
      return await this.fallbackGeocode(destination);
    } catch (error) {
      console.error('❌ Geocoding error:', error);
      return await this.fallbackGeocode(destination);
    }
  }
  
  private static async fallbackGeocode(destination: string): Promise<GeocodingResult | null> {
    try {
      const encodedDestination = encodeURIComponent(destination);
      // Using Nominatim API (OpenStreetMap) as fallback
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedDestination}&limit=1&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': `${config.app.name} (Web App)`,
        }
      });
      
      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const latitude = parseFloat(result.lat);
        const longitude = parseFloat(result.lon);

        // Extract place information
        const placeName = result.display_name;
        const address = result.address || {};
        const country = address.country;
        const region = address.state || address.region;

        return {
          coordinates: { latitude, longitude },
          placeName,
          country,
          region,
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Fallback geocoding error:', error);
      return null;
    }
  }

  // Coordenadas por defecto para destinos comunes (fallback)
  static getDefaultCoordinates(destination?: string): Coordinates {
    if (!destination) return { latitude: 40.4168, longitude: -3.7038 }; // Madrid

    const lowercaseDestination = destination.toLowerCase();
    
    const defaultLocations: Record<string, Coordinates> = {
      'madrid': { latitude: 40.4168, longitude: -3.7038 },
      'barcelona': { latitude: 41.3851, longitude: 2.1734 },
      'paris': { latitude: 48.8566, longitude: 2.3522 },
      'london': { latitude: 51.5074, longitude: -0.1278 },
      'roma': { latitude: 41.9028, longitude: 12.4964 },
      'rome': { latitude: 41.9028, longitude: 12.4964 },
      'new york': { latitude: 40.7128, longitude: -74.0060 },
      'tokyo': { latitude: 35.6762, longitude: 139.6503 },
      'amsterdam': { latitude: 52.3676, longitude: 4.9041 },
      'berlin': { latitude: 52.5200, longitude: 13.4050 },
      'lisbon': { latitude: 38.7223, longitude: -9.1393 },
      'lisboa': { latitude: 38.7223, longitude: -9.1393 },
    };

    for (const [city, coords] of Object.entries(defaultLocations)) {
      if (lowercaseDestination.includes(city)) {
        return coords;
      }
    }

    // Default to Madrid if no match found
    return { latitude: 40.4168, longitude: -3.7038 };
  }
}