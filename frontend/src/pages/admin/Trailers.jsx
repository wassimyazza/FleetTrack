import { useState, useEffect } from 'react';
import { trailerAPI } from '../../services/api';

const Trailers = () => {
    const [trailers, setTrailers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTrailer, setEditingTrailer] = useState(null);
    const [plateNumber, setPlateNumber] = useState('');
    const [type, setType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [status, setStatus] = useState('available');

    useEffect(() => {
        loadTrailers();
    }, []);

    const loadTrailers = async () => {
        try {
            const response = await trailerAPI.getAll();
            setTrailers(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingTrailer(null);
        setPlateNumber('');
        setType('');
        setCapacity('');
        setStatus('available');
        setShowModal(true);
    };

    const openEditModal = (trailer) => {
        setEditingTrailer(trailer);
        setPlateNumber(trailer.plateNumber);
        setType(trailer.type);
        setCapacity(trailer.capacity);
        setStatus(trailer.status);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            plateNumber: plateNumber,
            type: type,
            capacity: capacity,
            status: status
        };

        try {
            if (editingTrailer) {
                await trailerAPI.update(editingTrailer._id, data);
            } else {
                await trailerAPI.create(data);
            }
            closeModal();
            loadTrailers();
        } catch (error) {
            console.log(error);
            alert('Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm('Êtes-vous sûr de vouloir supprimer cette remorque?');
        if (confirm) {
            try {
                await trailerAPI.delete(id);
                loadTrailers();
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
                <h1 className="text-3xl font-bold text-gray-800">🚚 Gestion des Remorques</h1>
                <button onClick={openAddModal} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium">+ Ajouter une remorque</button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-primary-600 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left">Immatriculation</th>
                            <th className="px-6 py-4 text-left">Type</th>
                            <th className="px-6 py-4 text-left">Capacité</th>
                            <th className="px-6 py-4 text-left">Statut</th>
                            <th className="px-6 py-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trailers.map((trailer) => {
                            let statusColor = '';
                            let statusText = '';
                            
                            if (trailer.status === 'available') {
                                statusColor = 'bg-green-100 text-green-800';
                                statusText = 'Disponible';
                            } else if (trailer.status === 'in-use') {
                                statusColor = 'bg-blue-100 text-blue-800';
                                statusText = 'En service';
                            } else {
                                statusColor = 'bg-orange-100 text-orange-800';
                                statusText = 'Maintenance';
                            }

                            return (
                                <tr key={trailer._id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{trailer.plateNumber}</td>
                                    <td className="px-6 py-4">{trailer.type}</td>
                                    <td className="px-6 py-4">{trailer.capacity} tonnes</td>
                                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>{statusText}</span></td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => openEditModal(trailer)} className="text-blue-600 hover:text-blue-800 mr-3">✏️</button>
                                        <button onClick={() => handleDelete(trailer._id)} className="text-red-600 hover:text-red-800">🗑️</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {trailers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">Aucune remorque disponible</div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-2xl font-bold text-gray-800">{editingTrailer ? 'Modifier' : 'Ajouter'} une remorque</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Immatriculation</label>
                                <input type="text" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: R-12345-A" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Type</label>
                                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required>
                                    <option value="">Sélectionner un type</option>
                                    <option value="frigorifique">Frigorifique</option>
                                    <option value="bâchée">Bâchée</option>
                                    <option value="plateau">Plateau</option>
                                    <option value="citerne">Citerne</option>
                                    <option value="porte-conteneur">Porte-conteneur</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Capacité (tonnes)</label>
                                <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: 25" required />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">Statut</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                                    <option value="available">Disponible</option>
                                    <option value="in-use">En service</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
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

export default Trailers;