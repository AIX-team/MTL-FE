import { Outlet } from "react-router-dom";
// import Navbar from "../components/commons/Navbar";

function UserLayout() {

    return (
        <div className="layout-container">
            {/* <Navbar/> */}
            <div>
                <Outlet />
            </div>
        </div>
    ) 
}

export default UserLayout;