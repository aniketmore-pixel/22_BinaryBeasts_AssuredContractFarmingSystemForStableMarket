import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';
import './Layout.css';

const Layout = ({ children, role, title }) => {
    return (
        <div className="layout-root">
            <Sidebar role={role} />
            <div className="main-content">
                <Topbar title={title} userProfile={{ role }} />
                <motion.main
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="page-wrapper"
                >
                    {children}
                </motion.main>
            </div>
            <MobileNav role={role} />
        </div>
    );
};

export default Layout;
