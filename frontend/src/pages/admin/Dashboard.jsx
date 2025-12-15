import { useState, useEffect } from 'react';
import { reportAPI } from '../../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await reportAPI.getDashboard();
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Chargement...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-primary-100 text-sm">Total Camions</p>
                            <h3 className="text-4xl font-bold mt-2">{stats?.trucks.total || 0}</h3>
                        </div>
                        <div className="text-5xl opacity-50">🚛</div>
                    </div>
                    <div className="mt-4 text-sm text-primary-100">
                        <span className="font-semibold">{stats?.trucks.available || 0}</span> disponibles
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Trajets</p>
                            <h3 className="text-4xl font-bold mt-2">{stats?.trips.total || 0}</h3>
                        </div>
                        <div className="text-5xl opacity-50">🗺️</div>
                    </div>
                    <div className="mt-4 text-sm text-blue-100">
                        <span className="font-semibold">{stats?.trips.active || 0}</span> en cours
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm">Maintenance</p>
                            <h3 className="text-4xl font-bold mt-2">{stats?.maintenance.total || 0}</h3>
                        </div>
                        <div className="text-5xl opacity-50">🔧</div>
                    </div>
                    <div className="mt-4 text-sm text-orange-100">
                        <span className="font-semibold">{stats?.maintenance.totalCost || 0}</span> DH coût total
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Chauffeurs</p>
                            <h3 className="text-4xl font-bold mt-2">{stats?.drivers.total || 0}</h3>
                        </div>
                        <div className="text-5xl opacity-50">👨‍✈️</div>
                    </div>
                    <div className="mt-4 text-sm text-purple-100">
                        <span className="font-semibold">{stats?.fuel.totalConsumed || 0}</span> L gasoil
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">📈 État des Camions</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="text-gray-700">Disponibles</span>
                            <span className="font-bold text-primary-600">{stats?.trucks.available || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <span className="text-gray-700">En service</span>
                            <span className="font-bold text-blue-600">{stats?.trucks.inUse || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <span className="text-gray-700">En maintenance</span>
                            <span className="font-bold text-orange-600">{stats?.trucks.inMaintenance || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">🗺️ État des Trajets</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <span className="text-gray-700">À faire</span>
                            <span className="font-bold text-yellow-600">{stats?.trips.pending || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <span className="text-gray-700">En cours</span>
                            <span className="font-bold text-blue-600">{stats?.trips.active || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="text-gray-700">Terminés</span>
                            <span className="font-bold text-green-600">{stats?.trips.completed || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;