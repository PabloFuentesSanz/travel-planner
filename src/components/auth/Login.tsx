import { useState } from 'react';
import { MapPin, Chrome } from 'lucide-react';
import { Button } from '../ui';
import { supabase } from '../../lib/supabase';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      console.error('Error during Google authentication:', error);
      setError(error.message || 'Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <div className="bg-[rgb(var(--coral))] lg:w-1/2 flex flex-col justify-center items-center p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--coral))] to-[rgb(var(--coral-dark))] opacity-90" />
        
        <div className="relative z-10 text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MapPin size={48} className="text-white" />
            <h1 className="text-4xl font-bold">TravelPro</h1>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">
            Tu gestor de viajes perfecto
          </h2>
          
          <p className="text-lg opacity-90 leading-relaxed">
            Planifica, organiza y vive tus aventuras como nunca antes. 
            Una experiencia completamente personalizable y intuitiva.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/10 rounded-full" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-[rgb(var(--black))] mb-2">
              ¡Bienvenido!
            </h3>
            <p className="text-[rgb(var(--gray-300))] text-lg">
              Inicia sesión para comenzar tu aventura
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <Button
              onClick={handleGoogleAuth}
              loading={loading}
              size="lg"
              className="w-full"
              variant="outline"
            >
              <Chrome size={20} />
              Continuar con Google
            </Button>

            <div className="text-center">
              <p className="text-sm text-[rgb(var(--gray-300))]">
                Al continuar, aceptas nuestros términos de servicio y política de privacidad
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-[rgb(var(--gray-300))]">
              <span>✈️ Planifica</span>
              <span>•</span>
              <span>🗺️ Explora</span>
              <span>•</span>
              <span>📱 Comparte</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;