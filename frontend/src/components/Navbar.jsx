import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="bg-white shadow-md h-16 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-8">
            <div className="text-gray-600">
                Bienvenue, <span className="font-semibold text-primary-600">{user?.firstname}</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                    Rôle: <span className="font-medium text-primary-600">{user?.role}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                    Déconnexion
                </button>
            </div>
        </div>
    );
};

export default Navbar;