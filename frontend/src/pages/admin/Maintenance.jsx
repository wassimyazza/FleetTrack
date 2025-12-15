import { useState, useEffect } from 'react';
import { maintenanceAPI, truckAPI } from '../../services/api';

const Maintenance = () => {
    const [maintenances, setMaintenances] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMaintenance, setEditingMaintenance] = useState(null);
    const [truck, setTruck] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [cost, setCost] = useState(0);
    const [mileage, setMileage] = useState(0);
    const [nextMaintenanceAt, setNextMaintenanceAt] = useState('');

    useEffect(() => {
        loadMaintenances();
        loadTrucks();
    }, []);

    const loadMaintenances = async () => {
        try {
            const response = await maintenanceAPI.getAll();
            setMaintenances(response.data);
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

    const openAddModal = () => {
        setEditingMaintenance(null);
        setTruck('');
        setType('');
        setDescription('');
        setDate('');
        setCost(0);
        setMileage(0);
        setNextMaintenanceAt('');
        setShowModal(true);
    };

    const openEditModal = (maintenance) => {
        setEditingMaintenance(maintenance);
        setTruck(maintenance.truck._id);
        setType(maintenance.type);
        setDescription(maintenance.description);
        const maintenanceDate = maintenance.date.split('T')[0];
        setDate(maintenanceDate);
        setCost(maintenance.cost);
        setMileage(maintenance.mileage);
        setNextMaintenanceAt(maintenance.nextMaintenanceAt || '');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            truck: truck,
            type: type,
            description: description,
            date: date,
            cost: cost,
            mileage: mileage,
            nextMaintenanceAt: nextMaintenanceAt
        };

        try {
            if (editingMaintenance) {
                await maintenanceAPI.update(editingMaintenance._id, data);
            } else {
                await maintenanceAPI.create(data);
            }
            closeModal();
            loadMaintenances();
        } catch (error) {
            console.log(error);
            alert('Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm('Êtes-vous sûr de vouloir supprimer cette maintenance?');
        if (confirm) {
            try {
                await maintenanceAPI.delete(id);
                loadMaintenances();
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
                <h1 className="text-3xl font-bold text-gray-800">🔧 Gestion de la Maintenance</h1>
                <button onClick={openAddModal} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium">+ Ajouter une maintenance</button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-primary-600 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left">Camion</th>
                            <th className="px-6 py-4 text-left">Type</th>
                            <th className="px-6 py-4 text-left">Description</th>
                            <th className="px-6 py-4 text-left">Date</th>
                            <th className="px-6 py-4 text-left">Coût</th>
                            <th className="px-6 py-4 text-left">Kilométrage</th>
                            <th className="px-6 py-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {maintenances.map((maintenance) => {
                            let typeColor = '';
                            let typeText = '';
                            
                            if (maintenance.type === 'tire-change') {
                                typeColor = 'bg-purple-100 text-purple-800';
                                typeText = 'Changement pneus';
                            } else if (maintenance.type === 'oil-change') {
                                typeColor = 'bg-blue-100 text-blue-800';
                                typeText = 'Vidange';
                            } else if (maintenance.type === 'revision') {
                                typeColor = 'bg-green-100 text-green-800';
                                typeText = 'Révision';
                            } else {
                                typeColor = 'bg-red-100 text-red-800';
                                typeText = 'Réparation';
                            }

                            const maintenanceDate = new Date(maintenance.date);
                            const formattedDate = maintenanceDate.toLocaleDateString();

                            return (
                                <tr key={maintenance._id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{maintenance.truck.plateNumber}</td>
                                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColor}`}>{typeText}</span></td>
                                    <td className="px-6 py-4">{maintenance.description}</td>
                                    <td className="px-6 py-4">{formattedDate}</td>
                                    <td className="px-6 py-4">{maintenance.cost} DH</td>
                                    <td className="px-6 py-4">{maintenance.mileage} km</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => openEditModal(maintenance)} className="text-blue-600 hover:text-blue-800 mr-3">✏️</button>
                                        <button onClick={() => handleDelete(maintenance._id)} className="text-red-600 hover:text-red-800">🗑️</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {maintenances.length === 0 && (
                    <div className="text-center py-8 text-gray-500">Aucune maintenance disponible</div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-2xl font-bold text-gray-800">{editingMaintenance ? 'Modifier' : 'Ajouter'} une maintenance</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Camion *</label>
                                <select value={truck} onChange={(e) => setTruck(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required>
                                    <option value="">Sélectionner un camion</option>
                                    {trucks.map((t) => (
                                        <option key={t._id} value={t._id}>{t.plateNumber} - {t.brand} {t.model}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Type de maintenance *</label>
                                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required>
                                    <option value="">Sélectionner un type</option>
                                    <option value="tire-change">Changement de pneus</option>
                                    <option value="oil-change">Vidange</option>
                                    <option value="revision">Révision</option>
                                    <option value="repair">Réparation</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Description *</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" rows="3" placeholder="Décrivez la maintenance effectuée..." required></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Date *</label>
                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Coût (DH)</label>
                                    <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="0" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Kilométrage actuel *</label>
                                    <input type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: 50000" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Prochaine maintenance à (km)</label>
                                    <input type="number" value={nextMaintenanceAt} onChange={(e) => setNextMaintenanceAt(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: 60000" />
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

export default Maintenance;