import { IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import Nav from "../components/Nav";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <Nav />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
