import { HolderOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import "./WatchDetails.css";

interface WatchDetailsProps {
  watchData: any;
  timeframe: string;
}

const WatchDetails: React.FC<WatchDetailsProps> = ({
  watchData,
  timeframe,
}: WatchDetailsProps) => {
  console.log("poop", timeframe);
  return (
    <div className="detailsContainer">
      <div className="details">
        <img src={watchData.watch.image_url} alt="watch image" width="400" />
        <div className="detailsData">
          <div className="modelInfo">
            <div className="modelText">
              <h3>{watchData.watch.model.manufacturer}</h3>
              <h1>{watchData.watch.model.model_name}</h1>
              <p>{watchData.watch.reference_number}</p>
            </div>
            <hr />
            <div className="modelIcons">
              <PlusOutlined />
              <HolderOutlined />
            </div>
          </div>
          <div className="priceInfo">
            <Button style={{ width: "100%" }}>Details</Button>
          </div>
        </div>
      </div>
      <div className="detailsChart">Chart</div>
    </div>
  );
};

export default WatchDetails;
