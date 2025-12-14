import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64">
                <Navbar />
                <div className="mt-16 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;