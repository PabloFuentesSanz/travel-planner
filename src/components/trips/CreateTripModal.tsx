import { useState } from 'react';
import { MapPin, Users, Calendar, Plane, X } from 'lucide-react';
import { Modal, Button, Input, DateInput } from '../ui';
import { TripService, type CreateTripData } from '../../services/tripService';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated?: (tripId: string) => void;
}

interface CollaboratorEmail {
  id: string;
  email: string;
}

const CreateTripModal = ({
  isOpen,
  onClose,
  onTripCreated,
}: CreateTripModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simplified form state - removed title and description
  const [formData, setFormData] = useState({
    destination: '',
    start_date: '',
    end_date: '',
    budget: '',
    currency: 'EUR',
  });

  const [collaborators, setCollaborators] = useState<CollaboratorEmail[]>([]);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addCollaborator = () => {
    if (
      newCollaboratorEmail.trim() &&
      isValidEmail(newCollaboratorEmail.trim())
    ) {
      const email = newCollaboratorEmail.trim();
      if (!collaborators.find((c) => c.email === email)) {
        setCollaborators((prev) => [
          ...prev,
          { id: Date.now().toString(), email },
        ]);
        setNewCollaboratorEmail('');
      }
    }
  };

  const removeCollaborator = (id: string) => {
    setCollaborators((prev) => prev.filter((c) => c.id !== id));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!formData.destination.trim()) return 'El destino es obligatorio';
    if (!formData.start_date) return 'La fecha de inicio es obligatoria';
    if (!formData.end_date) return 'La fecha de fin es obligatoria';

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      return 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tripData: CreateTripData = {
        title: `Viaje a ${formData.destination.trim()}`, // Auto-generate title from destination
        destination: formData.destination.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        currency: formData.currency,
        collaboratorEmails:
          collaborators.length > 0
            ? collaborators.map((c) => c.email)
            : undefined,
      };

      const { trip, error: createError } = await TripService.createTrip(
        tripData
      );

      if (createError) {
        setError(createError);
        return;
      }

      // Reset form
      setFormData({
        destination: '',
        start_date: '',
        end_date: '',
        budget: '',
        currency: 'EUR',
      });
      setCollaborators([]);

      onTripCreated?.(trip.id);
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message || 'Error al crear el viaje');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newCollaboratorEmail.trim()) {
      e.preventDefault();
      addCollaborator();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="lg"
      showCloseButton={false}
    >
      <div className="relative">
        {/* Custom Header with Corporate Design */}
        <div className="bg-gradient-to-r from-[rgb(var(--coral))] to-[rgb(var(--coral-dark))] px-8 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Plane size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Nuevo Viaje</h2>
                  <p className="text-white/90 text-sm">
                    Planifica tu próxima aventura
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20"
                disabled={loading}
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/10 rounded-full"></div>
        </div>

        {/* Form Content */}
        <div className="p-8 scrollbar-thin max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                <div className="flex items-center">
                  <div className="text-red-400 mr-3">⚠️</div>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Destination Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[rgb(var(--coral))]/10 rounded-lg flex items-center justify-center">
                  <MapPin size={16} className="text-[rgb(var(--coral))]" />
                </div>
                <h3 className="text-lg font-semibold text-[rgb(var(--black))]">
                  ¿A dónde vamos?
                </h3>
              </div>

              <Input
                placeholder="ej. Barcelona, España"
                value={formData.destination}
                onChange={(e) =>
                  handleInputChange('destination', e.target.value)
                }
                className="text-lg py-4"
                disabled={loading}
              />
            </div>

            {/* Dates Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[rgb(var(--coral))]/10 rounded-lg flex items-center justify-center">
                  <Calendar size={16} className="text-[rgb(var(--coral))]" />
                </div>
                <h3 className="text-lg font-semibold text-[rgb(var(--black))]">
                  ¿Cuándo será el viaje?
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DateInput
                  label="Fecha de salida"
                  value={formData.start_date}
                  onChange={(date) => handleInputChange('start_date', date)}
                  minDate={new Date().toISOString().split('T')[0]}
                  disabled={loading}
                />

                <DateInput
                  label="Fecha de regreso"
                  value={formData.end_date}
                  onChange={(date) => handleInputChange('end_date', date)}
                  minDate={
                    formData.start_date ||
                    new Date().toISOString().split('T')[0]
                  }
                  disabled={loading}
                />
              </div>
            </div>

            {/* Budget Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[rgb(var(--coral))]/10 rounded-lg flex items-center justify-center">
                  <span className="text-[rgb(var(--coral))] font-bold">€</span>
                </div>
                <h3 className="text-lg font-semibold text-[rgb(var(--black))]">
                  Presupuesto estimado
                </h3>
                <span className="text-sm text-[rgb(var(--gray-300))] ml-auto">
                  (opcional)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="1500"
                    value={formData.budget}
                    onChange={(e) =>
                      handleInputChange('budget', e.target.value)
                    }
                    disabled={loading}
                  />
                </div>

                <select
                  value={formData.currency}
                  onChange={(e) =>
                    handleInputChange('currency', e.target.value)
                  }
                  className="px-4 py-2.5 text-[rgb(var(--black))] bg-white border border-[rgb(var(--gray-300))] rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-[rgb(var(--coral))]/20 focus:border-[rgb(var(--coral))]
                           disabled:bg-[rgb(var(--gray-50))] disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <option value="EUR">EUR €</option>
                  <option value="USD">USD $</option>
                  <option value="GBP">GBP £</option>
                </select>
              </div>
            </div>

            {/* Collaborators Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[rgb(var(--coral))]/10 rounded-lg flex items-center justify-center">
                  <Users size={16} className="text-[rgb(var(--coral))]" />
                </div>
                <h3 className="text-lg font-semibold text-[rgb(var(--black))]">
                  ¿Quién te acompaña?
                </h3>
                <span className="text-sm text-[rgb(var(--gray-300))] ml-auto">
                  (opcional)
                </span>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="email@ejemplo.com"
                  value={newCollaboratorEmail}
                  onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCollaborator}
                  disabled={
                    !newCollaboratorEmail.trim() ||
                    !isValidEmail(newCollaboratorEmail.trim()) ||
                    loading
                  }
                  className="whitespace-nowrap"
                >
                  Invitar
                </Button>
              </div>

              {collaborators.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-[rgb(var(--black))]">
                    Personas invitadas ({collaborators.length}):
                  </p>
                  <div className="space-y-2">
                    {collaborators.map((collaborator) => (
                      <div
                        key={collaborator.id}
                        className="flex items-center justify-between p-3 bg-[rgb(var(--coral))]/5 border border-[rgb(var(--coral))]/20 rounded-lg"
                      >
                        <span className="text-sm font-medium text-[rgb(var(--black))]">
                          {collaborator.email}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCollaborator(collaborator.id)}
                          className="text-[rgb(var(--coral))] hover:text-red-600 hover:bg-red-50"
                          disabled={loading}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-[rgb(var(--gray-50))] border-t border-[rgb(var(--gray-200))]">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              onClick={handleSubmit}
              variant="primary"
              loading={loading}
              disabled={loading}
              size="lg"
              className="min-w-[140px]"
            >
              {loading ? 'Creando...' : 'Crear Viaje'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateTripModal;
