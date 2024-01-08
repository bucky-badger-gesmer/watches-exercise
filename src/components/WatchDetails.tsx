import { HolderOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import {
  formatToPercentage,
  formatUSD,
  getCurrentDateFormatted,
  getDateDaysAgo,
  getDaysAgo,
} from "../utils/helpers";
import "./WatchDetails.css";

interface WatchDetailsProps {
  watchData: any;
  timeframe: string;
}

const WatchDetails: React.FC<WatchDetailsProps> = ({
  watchData,
  timeframe,
}: WatchDetailsProps) => {
  const [currentTimeframe, setCurrentTimeframe] = useState("1M");
  const [xAxisCategories, setXAxisCategories] = useState([]);
  const [chartColor, setChartColor] = useState("#00FF00");
  const [data, setData] = useState([]);
  const [percentageText, setPercentageText] = useState("");
  const [lowPrice, setLowPrice] = useState(0);
  const [highPrice, setHighPrice] = useState(0);
  const [openPrice, setOpenPrice] = useState(0);
  const [closePrice, setClosePrice] = useState(0);

  useEffect(() => {
    const days = getDaysAgo(timeframe);
    const today = getCurrentDateFormatted();
    const pastDate = getDateDaysAgo(days);

    fetch(
      `https://api-dev.horodex.io/watch_data/api/v1/watchutility?watch_ids=${watchData.watch.id}&start=${pastDate}&end=${today}&limit=-1&page=-1&orderBy=related_day&direction=asc`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        const xAxisCategories = response[0].daily_analytics.map(
          (o: any) => o.related_day
        );
        const data = response[0].daily_analytics.map((o: any) => o.price);
        const currentAnalytics = Object.keys(response[0].global_analytics).find(
          (childKey) => childKey.includes(timeframe.toLocaleLowerCase())
        );
        const globalAnalytics =
          response[0].global_analytics[currentAnalytics as string];
        const color =
          globalAnalytics.close - globalAnalytics.open < 0
            ? "#FF0000"
            : "#00FF00";
        const percentage =
          (globalAnalytics.close - globalAnalytics.open) / globalAnalytics.open;
        const formatPercentage = formatToPercentage(percentage);

        setXAxisCategories(xAxisCategories);
        setData(data);
        setChartColor(color);
        setPercentageText(formatPercentage);
        setLowPrice(globalAnalytics.low);
        setHighPrice(globalAnalytics.high);
        setOpenPrice(globalAnalytics.open);
        setClosePrice(globalAnalytics.close);
      })
      .catch((err) => {});
  }, []);

  const handleSetTimeFrame = (timeframe: string): void => {
    setCurrentTimeframe(timeframe);
    const days = getDaysAgo(timeframe);
    const today = getCurrentDateFormatted();
    const pastDate = getDateDaysAgo(days);

    fetch(
      `https://api-dev.horodex.io/watch_data/api/v1/watchutility?watch_ids=${watchData.watch.id}&start=${pastDate}&end=${today}&limit=-1&page=-1&orderBy=related_day&direction=asc`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        const xAxisCategories = response[0].daily_analytics;
        const data = response[0].daily_analytics.map((o: any) => o.price);
        const currentAnalytics = Object.keys(response[0].global_analytics).find(
          (childKey) => childKey.includes(timeframe.toLocaleLowerCase())
        );
        const globalAnalytics =
          response[0].global_analytics[currentAnalytics as string];
        const color =
          globalAnalytics.close - globalAnalytics.open < 0
            ? "#FF0000"
            : "#00FF00";
        const percentage =
          (globalAnalytics.close - globalAnalytics.open) / globalAnalytics.open;
        const formatPercentage = formatToPercentage(percentage);

        setXAxisCategories(xAxisCategories);
        setData(data);
        setChartColor(color);
        setPercentageText(formatPercentage);
        setLowPrice(globalAnalytics.low);
        setHighPrice(globalAnalytics.high);
        setOpenPrice(globalAnalytics.open);
        setClosePrice(globalAnalytics.close);
      })
      .catch((err) => {});
  };

  return (
    <div className="detailsContainer">
      <div className="details">
        <img
          src={watchData.watch.image_url}
          alt="watch image"
          width="400"
          height="400"
        />
        <div className="detailsData">
          <div className="modelInfo">
            <div className="modelText">
              <h3>{watchData.watch.model.manufacturer}</h3>
              <h1>{watchData.watch.model.model_name}</h1>
              <p>
                <strong>{watchData.watch.reference_number}</strong>
              </p>
            </div>
            <hr />
            <div className="modelIcons">
              <PlusOutlined />
              <HolderOutlined />
            </div>
          </div>
          <div className="priceInfo">
            <div className="priceRangeContainer">
              <div className="priceLow">
                <p>Low</p>
                <h2>{formatUSD(lowPrice)}</h2>
              </div>
              <div className="priceHigh">
                <p>High</p>
                <h2>{formatUSD(highPrice)}</h2>
              </div>
            </div>
            <div>
              <p>+/- Change</p>
              <h2>
                {closePrice - openPrice < 0
                  ? "-"
                  : "+" + formatUSD(closePrice - openPrice)}
              </h2>
            </div>
            <Button style={{ width: "100%", position: "absolute", bottom: 0 }}>
              Details
            </Button>
          </div>
        </div>
      </div>
      <div className="detailsChartContainer">
        <div className="detailsChartHeader">
          <div className="detailsPrice">
            <h3>
              <strong>{formatUSD(closePrice)}</strong>
            </h3>
            <h2 style={{ color: chartColor, fontWeight: "bolder" }}>
              {percentageText}
            </h2>
          </div>
          <ul className="timeFilter">
            <li
              onClick={() => handleSetTimeFrame("1M")}
              style={{
                textDecoration:
                  currentTimeframe === "1M" ? "underline" : "none",
                color: currentTimeframe === "1M" ? "white" : "light-grey",
                fontWeight: currentTimeframe === "1M" ? "bolder" : 100,
              }}
            >
              1M
            </li>
            <li
              onClick={() => handleSetTimeFrame("3M")}
              style={{
                textDecoration:
                  currentTimeframe === "3M" ? "underline" : "none",
                color: currentTimeframe === "3M" ? "white" : "light-grey",
                fontWeight: currentTimeframe === "3M" ? "bolder" : 100,
              }}
            >
              3M
            </li>
            <li
              onClick={() => handleSetTimeFrame("6M")}
              style={{
                textDecoration:
                  currentTimeframe === "6M" ? "underline" : "none",
                color: currentTimeframe === "6M" ? "white" : "light-grey",
                fontWeight: currentTimeframe === "6M" ? "bolder" : 100,
              }}
            >
              6M
            </li>
            <li
              onClick={() => handleSetTimeFrame("1Y")}
              style={{
                textDecoration:
                  currentTimeframe === "1Y" ? "underline" : "none",
                color: currentTimeframe === "1Y" ? "white" : "light-grey",
                fontWeight: currentTimeframe === "1Y" ? "bolder" : 100,
              }}
            >
              1Y
            </li>
            <li
              onClick={() => handleSetTimeFrame("3Y")}
              style={{
                textDecoration:
                  currentTimeframe === "3Y" ? "underline" : "none",
                color: currentTimeframe === "3Y" ? "white" : "light-grey",
                fontWeight: currentTimeframe === "3Y" ? "bolder" : 100,
              }}
            >
              3Y
            </li>
            <li
              onClick={() => handleSetTimeFrame("5Y")}
              style={{
                textDecoration:
                  currentTimeframe === "5Y" ? "underline" : "none",
                color: currentTimeframe === "5Y" ? "white" : "light-grey",
                fontWeight: currentTimeframe === "5Y" ? "bolder" : 100,
              }}
            >
              5Y
            </li>
          </ul>
        </div>
        <ApexCharts
          options={{
            chart: {
              id: "basic-line",
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false, // Disables zooming
              },
              foreColor: "red",
            },
            grid: {
              show: false,
            },
            markers: {
              size: 0, // Hides markers
            },
            tooltip: {
              enabled: true,
              theme: "dark",
              y: {
                formatter: (val) => formatUSD(val),
              },
            },
            colors: [chartColor],
            xaxis: {
              categories: xAxisCategories,
              labels: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              crosshairs: {
                show: false,
              },
            },
            yaxis: {
              show: false,
            },
          }}
          series={[
            {
              name: "series-1",
              data: data,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default WatchDetails;
