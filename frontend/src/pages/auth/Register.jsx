import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await register(formData);
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/driver/trips');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                if (Array.isArray(err.response.data)) {
                    setError(err.response.data.map(e => e.error).join(', '));
                } else {
                    setError(err.response.data.message || 'Erreur lors de l\'inscription');
                }
            } else {
                setError('Erreur lors de l\'inscription');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🚛</div>
                    <h1 className="text-4xl font-bold text-primary-600 mb-2">FleetFlow</h1>
                    <p className="text-gray-600">Créer votre compte</p>
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Prénom</label>
                            <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="John" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Nom</label>
                            <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Doe" required />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="votre.email@example.com" required />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Mot de passe</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="••••••••" required />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50">{loading ? 'Inscription...' : 'S\'inscrire'}</button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">Déjà un compte? <Link to="/login" className="text-primary-600 hover:underline font-medium">Se connecter</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;