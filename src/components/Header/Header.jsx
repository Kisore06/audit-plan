import { MenuRounded} from "@mui/icons-material";
import './Header.css';
import Logo from "../../Assets/header/Bannari_Amman_Institute_of_Technology_logo.png";
// import "./style.css";

function Header(props) {

  return (
    <div
      className="app-topbar"
      style={{
        backgroundColor: "white",
        display: "flex",
        padding: "10px 25px",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div style={{ display: "flex", gap: 20, width: "100%" }}>
        <div className="topbar-title-block">
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <img width={30} src={Logo} alt="logo" />
            <h3 className="topbar-title">Audit</h3>
          </div>
          <div onClick={props.sidebar} className="menu-icon sidebar-menu">
            <MenuRounded />
          </div>
        </div>
      </div>
      {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div className="menu-icon">
            <NotificationsOutlined />
          </div>
          <div className="topbar-account">
            <img width={30} src={UserLogo} alt="user" />
            <SettingsOutlined />
          </div>
        </div> */}
    </div>
  );
}

export default Header;