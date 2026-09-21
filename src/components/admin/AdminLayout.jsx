import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

import "../../styles/AdminLayout.css";


function AdminLayout() {
    return (
        <div className="admin-layout">

            {/* ==========================================
                SIDEBAR
            ========================================== */}

            <AdminSidebar />


            {/* ==========================================
                CONTENU ADMIN
            ========================================== */}

            <main className="admin-main">

                {/* ======================================
                    HEADER
                ====================================== */}

                <AdminHeader />


                {/* ======================================
                    PAGE COURANTE
                ====================================== */}

                <div className="admin-content">
                    <Outlet />
                </div>

            </main>

        </div>
    );
}


export default AdminLayout;