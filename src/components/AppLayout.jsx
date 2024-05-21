import React, { useState } from "react";
import TopBar from "../components/Header/Header";
import './Header/Header.css'
import AppSideBar from "./navbar/Verticalnav";
import Footer from '../components/Footer/Footer'; // Make sure the path matches where your Footer component is located

function AppLayout(props){
    const [sidebarState,setSideBarState] = useState(false);
    const handleSideBar=()=>{
        setSideBarState(!sidebarState)
    }

    return (
        <div style={{
            backgroundColor: "white",
            minHeight: '100vh', // Changed from height to minHeight
            width: '100%',
            position: 'relative',
        }}>
            <TopBar sidebar={handleSideBar}/>
            <div style={{height:'100%',display:'flex'}}>
                <AppSideBar open={sidebarState} resource={props.rId}/> 
                <div className={"app-body"} style={{width:'100%'}} >{props.body}</div>
            </div>
            <Footer /> {/* Include the Footer here */}
        </div>
    )
}

export default AppLayout;
