import { useState, useEffect } from 'react';
import { tripAPI } from '../../services/api';

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [status, setStatus] = useState('');
    const [startMileage, setStartMileage] = useState('');
    const [endMileage, setEndMileage] = useState('');
    const [fuelUsed, setFuelUsed] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        loadMyTrips();
    }, []);

    const loadMyTrips = async () => {
        try {
            const response = await tripAPI.getMyTrips();
            setTrips(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const openModal = (trip) => {
        setSelectedTrip(trip);
        setStatus(trip.status);
        setStartMileage(trip.startMileage || '');
        setEndMileage(trip.endMileage || '');
        setFuelUsed(trip.fuelUsed || '');
        setNotes(trip.notes || '');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            status: status,
            startMileage: startMileage,
            endMileage: endMileage,
            fuelUsed: fuelUsed,
            notes: notes
        };

        try {
            await tripAPI.updateStatus(selectedTrip._id, data);
            closeModal();
            loadMyTrips();
            alert('Trajet mis à jour avec succès!');
        } catch (error) {
            console.log(error);
            alert('Erreur lors de la mise à jour');
        }
    };

    const downloadPDF = async (tripId) => {
        try {
            const response = await tripAPI.downloadPDF(tripId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `trajet-${tripId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.log(error);
            alert('Erreur lors du téléchargement du PDF');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Chargement...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">🗺️ Mes Trajets</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <div key={trip._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>{statusText}</span>
                                <span className="text-gray-500 text-sm">{formattedDate}</span>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">📍</span>
                                    <div>
                                        <p className="text-xs text-gray-500">Départ</p>
                                        <p className="font-bold text-gray-800">{trip.departure}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🎯</span>
                                    <div>
                                        <p className="text-xs text-gray-500">Destination</p>
                                        <p className="font-bold text-gray-800">{trip.destination}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4 mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">🚛</span>
                                    <p className="text-sm text-gray-700">{trip.truck.plateNumber}</p>
                                </div>
                                {trip.trailer && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">🚚</span>
                                        <p className="text-sm text-gray-700">{trip.trailer.plateNumber}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => openModal(trip)} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium text-sm">Modifier</button>
                                <button onClick={() => downloadPDF(trip._id)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm">📄 PDF</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {trips.length === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun trajet assigné</h2>
                    <p className="text-gray-600">Vous n'avez pas de trajets pour le moment.</p>
                </div>
            )}

            {showModal && selectedTrip && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-2xl font-bold text-gray-800">Mise à jour du trajet</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <h4 className="font-bold text-gray-800 mb-2">Informations du trajet</h4>
                                <p className="text-sm text-gray-600">De <span className="font-medium">{selectedTrip.departure}</span> à <span className="font-medium">{selectedTrip.destination}</span></p>
                                <p className="text-sm text-gray-600">Camion: <span className="font-medium">{selectedTrip.truck.plateNumber}</span></p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Statut *</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required>
                                    <option value="todo">À faire</option>
                                    <option value="in-progress">En cours</option>
                                    <option value="completed">Terminé</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Kilométrage départ (km)</label>
                                    <input type="number" value={startMileage} onChange={(e) => setStartMileage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: 50000" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Kilométrage arrivée (km)</label>
                                    <input type="number" value={endMileage} onChange={(e) => setEndMileage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: 50500" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Gasoil utilisé (Litres)</label>
                                <input type="number" value={fuelUsed} onChange={(e) => setFuelUsed(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: 150" />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">Remarques / Notes</label>
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" rows="4" placeholder="Ajoutez vos remarques sur l'état du véhicule, les conditions de route, etc..."></textarea>
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

export default MyTrips;