import { useState, useEffect } from 'react';
import { reportAPI } from '../../services/api';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('fuel');
    const [fuelReport, setFuelReport] = useState([]);
    const [mileageReport, setMileageReport] = useState([]);
    const [maintenanceReport, setMaintenanceReport] = useState(null);
    const [driversReport, setDriversReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const fuelRes = await reportAPI.getFuel();
            setFuelReport(fuelRes.data);

            const mileageRes = await reportAPI.getMileage();
            setMileageReport(mileageRes.data);

            const maintenanceRes = await reportAPI.getMaintenance();
            setMaintenanceReport(maintenanceRes.data);

            const driversRes = await reportAPI.getDrivers();
            setDriversReport(driversRes.data);

            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleFilter = async () => {
        if (!startDate || !endDate) {
            alert('Veuillez sélectionner les dates');
            return;
        }

        try {
            const params = {
                startDate: startDate,
                endDate: endDate
            };

            if (activeTab === 'fuel') {
                const res = await reportAPI.getFuel(params);
                setFuelReport(res.data);
            } else if (activeTab === 'mileage') {
                const res = await reportAPI.getMileage(params);
                setMileageReport(res.data);
            } else if (activeTab === 'maintenance') {
                const res = await reportAPI.getMaintenance(params);
                setMaintenanceReport(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const resetFilter = () => {
        setStartDate('');
        setEndDate('');
        loadReports();
    };

    if (loading) {
        return <div className="text-center py-8">Chargement...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">📈 Rapports et Statistiques</h1>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-2">Date de début</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-2">Date de fin</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <button onClick={handleFilter} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium">Filtrer</button>
                    <button onClick={resetFilter} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium">Réinitialiser</button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex border-b">
                    <button onClick={() => setActiveTab('fuel')} className={`flex-1 px-6 py-4 font-medium ${activeTab === 'fuel' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>⛽ Consommation Gasoil</button>
                    <button onClick={() => setActiveTab('mileage')} className={`flex-1 px-6 py-4 font-medium ${activeTab === 'mileage' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>📏 Kilométrage</button>
                    <button onClick={() => setActiveTab('maintenance')} className={`flex-1 px-6 py-4 font-medium ${activeTab === 'maintenance' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>🔧 Maintenance</button>
                    <button onClick={() => setActiveTab('drivers')} className={`flex-1 px-6 py-4 font-medium ${activeTab === 'drivers' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>👨‍✈️ Chauffeurs</button>
                </div>

                <div className="p-6">
                    {activeTab === 'fuel' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Rapport de Consommation de Gasoil</h2>
                            {fuelReport.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">Camion</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">Total Gasoil (L)</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">Nombre de trajets</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fuelReport.map((item, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="px-6 py-4">{item.truck}</td>
                                                <td className="px-6 py-4 font-bold text-primary-600">{item.totalFuel} L</td>
                                                <td className="px-6 py-4">{item.tripCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {activeTab === 'mileage' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Rapport de Kilométrage</h2>
                            {mileageReport.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">Camion</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">Distance totale (km)</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">Kilométrage actuel</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">Nombre de trajets</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mileageReport.map((item, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="px-6 py-4">{item.truck}</td>
                                                <td className="px-6 py-4 font-bold text-primary-600">{item.totalDistance} km</td>
                                                <td className="px-6 py-4">{item.currentMileage} km</td>
                                                <td className="px-6 py-4">{item.tripCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {activeTab === 'maintenance' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Rapport de Maintenance</h2>
                            {maintenanceReport ? (
                                <div>
                                    <div className="bg-primary-50 rounded-lg p-6 mb-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">Coût Total</h3>
                                        <p className="text-3xl font-bold text-primary-600">{maintenanceReport.totalCost} DH</p>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">Par Type de Maintenance</h3>
                                        <table className="w-full">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Type</th>
                                                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Nombre</th>
                                                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Coût Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(maintenanceReport.byType).map((key) => {
                                                    const item = maintenanceReport.byType[key];
                                                    let typeName = '';
                                                    if (key === 'tire-change') typeName = 'Changement pneus';
                                                    else if (key === 'oil-change') typeName = 'Vidange';
                                                    else if (key === 'revision') typeName = 'Révision';
                                                    else typeName = 'Réparation';

                                                    return (
                                                        <tr key={key} className="border-b hover:bg-gray-50">
                                                            <td className="px-6 py-4">{typeName}</td>
                                                            <td className="px-6 py-4">{item.count}</td>
                                                            <td className="px-6 py-4 font-bold text-primary-600">{item.totalCost} DH</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">Par Camion</h3>
                                        <table className="w-full">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Camion</th>
                                                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Nombre</th>
                                                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Coût Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(maintenanceReport.byTruck).map((key) => {
                                                    const item = maintenanceReport.byTruck[key];
                                                    return (
                                                        <tr key={key} className="border-b hover:bg-gray-50">
                                                            <td className="px-6 py-4">{item.truck}</td>
                                                            <td className="px-6 py-4">{item.count}</td>
                                                            <td className="px-6 py-4 font-bold text-primary-600">{item.totalCost} DH</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'drivers' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Performance des Chauffeurs</h2>
                            {driversReport.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">Chauffeur</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">Total Trajets</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">Distance (km)</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">Gasoil (L)</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">Conso. Moyenne (L/100km)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {driversReport.map((driver, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium">{driver.driver}</td>
                                                <td className="px-6 py-4">{driver.totalTrips}</td>
                                                <td className="px-6 py-4">{driver.totalDistance} km</td>
                                                <td className="px-6 py-4">{driver.totalFuel} L</td>
                                                <td className="px-6 py-4 font-bold text-primary-600">{driver.averageFuelConsumption} L/100km</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;