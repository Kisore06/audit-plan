import TopBar from "../components/Header/Header";
import './Header/Header.css'
import AppSideBar from "./navbar/Verticalnav";
import { useState } from "react";

function AppLayout(props){
    const [sidebarState,setSideBarState] = useState(false);
    const handleSideBar=(()=>{
        setSideBarState(!sidebarState)
    })

    return (
        <div style={{
            backgroundColor:"rgb(238, 242, 246)",
            height:'100vh',
            width:'100vw',
            position:'fixed'
        }}>
            <TopBar sidebar={handleSideBar}/>
            <div style={{height:'100%',display:'flex'}}>
                <AppSideBar open={sidebarState} resource={props.rId}/> 
                <div className={"app-body"} style={{width:'100%'}} >{props.body}</div>
            </div>
        </div>
    )
}


export default AppLayout;