import { useState, useEffect } from 'react';
import { tripAPI, truckAPI, trailerAPI, userAPI } from '../../services/api';

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [trailers, setTrailers] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTrip, setEditingTrip] = useState(null);
    const [driver, setDriver] = useState('');
    const [truck, setTruck] = useState('');
    const [trailer, setTrailer] = useState('');
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [status, setStatus] = useState('todo');

    useEffect(() => {
        loadTrips();
        loadTrucks();
        loadTrailers();
        loadDrivers();
    }, []);

    const loadTrips = async () => {
        try {
            const response = await tripAPI.getAll();
            setTrips(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const loadTrucks = async () => {
        try {
            const response = await truckAPI.getAll();
            setTrucks(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const loadTrailers = async () => {
        try {
            const response = await trailerAPI.getAll();
            setTrailers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const loadDrivers = async () => {
        try {
            const response = await userAPI.getDrivers();
            setDrivers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const openAddModal = () => {
        setEditingTrip(null);
        setDriver('');
        setTruck('');
        setTrailer('');
        setDeparture('');
        setDestination('');
        setDepartureDate('');
        setStatus('todo');
        setShowModal(true);
    };

    const openEditModal = (trip) => {
        setEditingTrip(trip);
        setDriver(trip.driver._id);
        setTruck(trip.truck._id);
        setTrailer(trip.trailer ? trip.trailer._id : '');
        setDeparture(trip.departure);
        setDestination(trip.destination);
        const date = trip.departureDate.split('T')[0];
        setDepartureDate(date);
        setStatus(trip.status);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            driver: driver,
            truck: truck,
            trailer: trailer,
            departure: departure,
            destination: destination,
            departureDate: departureDate,
            status: status
        };

        try {
            if (editingTrip) {
                await tripAPI.update(editingTrip._id, data);
            } else {
                await tripAPI.create(data);
            }
            closeModal();
            loadTrips();
        } catch (error) {
            console.log(error);
            alert('Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm('Êtes-vous sûr de vouloir supprimer ce trajet?');
        if (confirm) {
            try {
                await tripAPI.delete(id);
                loadTrips();
            } catch (error) {
                console.log(error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    if (loading) {
        return <div className="text-center py-8">Chargement...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">🗺️ Gestion des Trajets</h1>
                <button onClick={openAddModal} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium">+ Créer un trajet</button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-primary-600 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left">Chauffeur</th>
                            <th className="px-6 py-4 text-left">Camion</th>
                            <th className="px-6 py-4 text-left">Départ</th>
                            <th className="px-6 py-4 text-left">Destination</th>
                            <th className="px-6 py-4 text-left">Date</th>
                            <th className="px-6 py-4 text-left">Statut</th>
                            <th className="px-6 py-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trips.map((trip) => {
                            let statusColor = '';
                            let statusText = '';
                            
                            if (trip.status === 'todo') {
                                statusColor = 'bg-yellow-100 text-yellow-800';
                                statusText = 'À faire';
                            } else if (trip.status === 'in-progress') {
                                statusColor = 'bg-blue-100 text-blue-800';
                                statusText = 'En cours';
                            } else {
                                statusColor = 'bg-green-100 text-green-800';
                                statusText = 'Terminé';
                            }

                            const tripDate = new Date(trip.departureDate);
                            const formattedDate = tripDate.toLocaleDateString();

                            return (
                                <tr key={trip._id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{trip.driver.firstname} {trip.driver.lastname}</td>
                                    <td className="px-6 py-4">{trip.truck.plateNumber}</td>
                                    <td className="px-6 py-4">{trip.departure}</td>
                                    <td className="px-6 py-4">{trip.destination}</td>
                                    <td className="px-6 py-4">{formattedDate}</td>
                                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>{statusText}</span></td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => openEditModal(trip)} className="text-blue-600 hover:text-blue-800 mr-3">✏️</button>
                                        <button onClick={() => handleDelete(trip._id)} className="text-red-600 hover:text-red-800">🗑️</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {trips.length === 0 && (
                    <div className="text-center py-8 text-gray-500">Aucun trajet disponible</div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-2xl font-bold text-gray-800">{editingTrip ? 'Modifier' : 'Créer'} un trajet</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Chauffeur *</label>
                                    <select value={driver} onChange={(e) => setDriver(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required>
                                        <option value="">Sélectionner un chauffeur</option>
                                        {drivers.map((d) => (
                                            <option key={d._id} value={d._id}>{d.firstname} {d.lastname}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Camion *</label>
                                    <select value={truck} onChange={(e) => setTruck(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required>
                                        <option value="">Sélectionner un camion</option>
                                        {trucks.map((t) => {
                                            const isAvailable = t.status === 'available';
                                            const isCurrentTruck = editingTrip && editingTrip.truck._id === t._id;
                                            
                                            if (isAvailable || isCurrentTruck) {
                                                return <option key={t._id} value={t._id}>{t.plateNumber} - {t.brand}</option>;
                                            }
                                            return null;
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Remorque (optionnel)</label>
                                <select value={trailer} onChange={(e) => setTrailer(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                                    <option value="">Aucune remorque</option>
                                    {trailers.map((t) => {
                                        const isAvailable = t.status === 'available';
                                        const isCurrentTrailer = editingTrip && editingTrip.trailer && editingTrip.trailer._id === t._id;
                                        
                                        if (isAvailable || isCurrentTrailer) {
                                            return <option key={t._id} value={t._id}>{t.plateNumber} - {t.type}</option>;
                                        }
                                        return null;
                                    })}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Départ *</label>
                                    <input type="text" value={departure} onChange={(e) => setDeparture(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: Casablanca" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Destination *</label>
                                    <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: Tanger" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Date de départ *</label>
                                    <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Statut</label>
                                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                                        <option value="todo">À faire</option>
                                        <option value="in-progress">En cours</option>
                                        <option value="completed">Terminé</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={closeModal} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium">Annuler</button>
                                <button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trips;