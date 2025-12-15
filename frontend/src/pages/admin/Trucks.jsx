import { useState, useEffect } from 'react';
import { truckAPI } from '../../services/api';

const Trucks = () => {
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTruck, setEditingTruck] = useState(null);
    const [formData, setFormData] = useState({
        plateNumber: '',
        brand: '',
        model: '',
        year: '',
        mileage: 0,
        status: 'available'
    });

    useEffect(() => {
        fetchTrucks();
    }, []);

    const fetchTrucks = async () => {
        try {
            const response = await truckAPI.getAll();
            setTrucks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTruck) {
                await truckAPI.update(editingTruck._id, formData);
            } else {
                await truckAPI.create(formData);
            }
            setShowModal(false);
            setFormData({ plateNumber: '', brand: '', model: '', year: '', mileage: 0, status: 'available' });
            setEditingTruck(null);
            fetchTrucks();
        } catch (error) {
            console.error('Error:', error);
            alert('Erreur lors de l\'enregistrement');
        }
    };

    const handleEdit = (truck) => {
        setEditingTruck(truck);
        setFormData({ plateNumber: truck.plateNumber, brand: truck.brand, model: truck.model, year: truck.year, mileage: truck.mileage, status: truck.status });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce camion?')) {
            try {
                await truckAPI.delete(id);
                fetchTrucks();
            } catch (error) {
                console.error('Error:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const getStatusColor = (status) => {
        if (status === 'available') return 'bg-green-100 text-green-800';
        if (status === 'in-use') return 'bg-blue-100 text-blue-800';
        return 'bg-orange-100 text-orange-800';
    };

    const getStatusText = (status) => {
        if (status === 'available') return 'Disponible';
        if (status === 'in-use') return 'En service';
        return 'Maintenance';
    };

    if (loading) return <div className="text-center py-8">Chargement...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">🚛 Gestion des Camions</h1>
                <button onClick={() => { setShowModal(true); setEditingTruck(null); setFormData({ plateNumber: '', brand: '', model: '', year: '', mileage: 0, status: 'available' }); }} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium">+ Ajouter un camion</button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-primary-600 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left">Immatriculation</th>
                            <th className="px-6 py-4 text-left">Marque</th>
                            <th className="px-6 py-4 text-left">Modèle</th>
                            <th className="px-6 py-4 text-left">Année</th>
                            <th className="px-6 py-4 text-left">Kilométrage</th>
                            <th className="px-6 py-4 text-left">Statut</th>
                            <th className="px-6 py-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trucks.map((truck) => (
                            <tr key={truck._id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{truck.plateNumber}</td>
                                <td className="px-6 py-4">{truck.brand}</td>
                                <td className="px-6 py-4">{truck.model}</td>
                                <td className="px-6 py-4">{truck.year}</td>
                                <td className="px-6 py-4">{truck.mileage} km</td>
                                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(truck.status)}`}>{getStatusText(truck.status)}</span></td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleEdit(truck)} className="text-blue-600 hover:text-blue-800 mr-3">✏️</button>
                                    <button onClick={() => handleDelete(truck._id)} className="text-red-600 hover:text-red-800">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-2xl font-bold text-gray-800">{editingTruck ? 'Modifier' : 'Ajouter'} un camion</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Immatriculation</label>
                                <input type="text" value={formData.plateNumber} onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Marque</label>
                                <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Modèle</label>
                                <input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Année</label>
                                <input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Kilométrage</label>
                                <input type="number" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">Statut</label>
                                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                                    <option value="available">Disponible</option>
                                    <option value="in-use">En service</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium">Annuler</button>
                                <button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trucks;