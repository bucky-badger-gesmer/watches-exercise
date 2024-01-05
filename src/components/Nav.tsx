import { BellOutlined, SearchOutlined } from "@ant-design/icons";
import { IonTitle } from "@ionic/react";
import "./Nav.css";

const Nav: React.FC = () => {
  return (
    <div className="titleContainer">
      <div>
        <IonTitle>WATCHES.IO</IonTitle>
      </div>
      <div>
        <ul className="navContainer">
          <li>PORTFOLIO</li>
          <li className="explore">EXPLORE</li>
          <li>MARKETPLACE</li>
          <li>NEWS</li>
        </ul>
      </div>
      <div className="account">
        <IonTitle>
          <SearchOutlined />
          {"    "}
          <BellOutlined />
          {"    "}
          ACCOUNT
        </IonTitle>
      </div>
    </div>
  );
};

export default Nav;
