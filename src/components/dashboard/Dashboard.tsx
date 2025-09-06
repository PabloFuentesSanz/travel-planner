import { LogOut, MapPin, Plus, Settings, User } from 'lucide-react';
import { Button } from '../ui';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--gray-50))]">
      {/* Header */}
      <header className="bg-white border-b border-[rgb(var(--gray-200))] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <MapPin size={32} className="text-[rgb(var(--coral))]" />
              <h1 className="text-2xl font-bold text-[rgb(var(--black))]">TravelPro</h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-[rgb(var(--black))]">
                    {user?.user_metadata?.full_name || user?.email}
                  </p>
                  <p className="text-xs text-[rgb(var(--gray-300))]">
                    {user?.email}
                  </p>
                </div>
                {user?.user_metadata?.avatar_url && (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full"
                  />
                )}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignOut}
                className="text-[rgb(var(--gray-300))] hover:text-[rgb(var(--coral))]"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[rgb(var(--black))] mb-2">
            ¡Hola, {user?.user_metadata?.full_name?.split(' ')[0] || 'Viajero'}! 👋
          </h2>
          <p className="text-[rgb(var(--gray-300))] text-lg">
            ¿Listo para planificar tu próxima aventura?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgb(var(--gray-200))] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[rgb(var(--coral))]/10 rounded-lg">
                <Plus size={24} className="text-[rgb(var(--coral))]" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-[rgb(var(--black))] mb-2">
              Nuevo Viaje
            </h3>
            <p className="text-[rgb(var(--gray-300))] text-sm mb-4">
              Comienza a planificar tu próxima aventura
            </p>
            <Button variant="primary" size="sm" className="w-full">
              Crear Viaje
            </Button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgb(var(--gray-200))] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[rgb(var(--coral))]/10 rounded-lg">
                <MapPin size={24} className="text-[rgb(var(--coral))]" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-[rgb(var(--black))] mb-2">
              Mis Viajes
            </h3>
            <p className="text-[rgb(var(--gray-300))] text-sm mb-4">
              Ver y gestionar todos tus viajes
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Ver Viajes
            </Button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgb(var(--gray-200))] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[rgb(var(--coral))]/10 rounded-lg">
                <Settings size={24} className="text-[rgb(var(--coral))]" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-[rgb(var(--black))] mb-2">
              Configuración
            </h3>
            <p className="text-[rgb(var(--gray-300))] text-sm mb-4">
              Personaliza tu experiencia
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Configurar
            </Button>
          </div>
        </div>

        {/* Recent Activity / Empty State */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-[rgb(var(--gray-200))]">
          <div className="text-center">
            <div className="w-16 h-16 bg-[rgb(var(--coral))]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-[rgb(var(--coral))]" />
            </div>
            <h3 className="text-xl font-semibold text-[rgb(var(--black))] mb-2">
              ¡Tu primera aventura te espera!
            </h3>
            <p className="text-[rgb(var(--gray-300))] mb-6 max-w-md mx-auto">
              Crea tu primer viaje y comienza a descubrir todas las herramientas 
              que tenemos para hacer tu experiencia inolvidable.
            </p>
            <Button variant="primary" size="lg">
              <Plus size={20} />
              Crear mi primer viaje
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;