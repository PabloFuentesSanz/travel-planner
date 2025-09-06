// Función para detectar el entorno de manera más confiable
const getEnvironment = () => {
  // Método 1: Verificar hostname
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.startsWith('192.168.');
    
    if (isLocalhost) return 'development';
  }
  
  // Método 2: Verificar NODE_ENV o MODE de Vite
  if (import.meta.env.MODE === 'development' || import.meta.env.DEV) {
    return 'development';
  }
  
  return 'production';
};

const environment = getEnvironment();

// Configuración de entorno
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://lweskjeohexrlrmfwipf.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZXNramVvaGV4cmxybWZ3aXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNzgzNTEsImV4cCI6MjA3Mjc1NDM1MX0.f61NM9yr7GEVtKkWVANceLM0oOqwj5H5gW4DGiVFr-I'
  },
  app: {
    baseUrl: environment === 'development'
      ? 'http://localhost:5173'
      : (import.meta.env.VITE_APP_URL || 'https://ryokoplanner.vercel.app'),
    isDevelopment: environment === 'development',
    isProduction: environment === 'production',
    environment
  }
};

// Debug info (solo en desarrollo)
if (config.app.isDevelopment) {
  console.log('🔧 Config Debug:', {
    environment,
    baseUrl: config.app.baseUrl,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    VITE_APP_URL: import.meta.env.VITE_APP_URL
  });
}

// Función helper para obtener la URL de redirección
export const getRedirectUrl = (path: string = '/dashboard') => {
  const url = `${config.app.baseUrl}${path}`;
  console.log(`🔗 Redirect URL: ${url}`);
  return url;
};