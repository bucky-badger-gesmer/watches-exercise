import { HolderOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import {
  formatToPercentage,
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
        console.log("xAxisCategories", xAxisCategories);
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
        console.log("percent", formatPercentage);

        setXAxisCategories(xAxisCategories);
        setData(data);
        setChartColor(color);
        setPercentageText(formatPercentage);
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
        console.log("percent", formatPercentage);
        setXAxisCategories(xAxisCategories);
        setData(data);
        setChartColor(color);
        setPercentageText(formatPercentage);
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
              <p>{watchData.watch.reference_number}</p>
            </div>
            <hr />
            <div className="modelIcons">
              <PlusOutlined />
              <HolderOutlined />
            </div>
          </div>
          <div className="priceInfo">
            <Button style={{ width: "100%", marginTop: 200 }}>Details</Button>
          </div>
        </div>
      </div>
      <div className="detailsChartContainer">
        <div className="detailsChartHeader">
          <div className="detailsPrice">
            <h3>{watchData.global_analytics.analytics_1d.close}</h3>
            <h2 style={{ color: chartColor }}>{percentageText}</h2>
          </div>
          <ul className="timeFilter">
            <li
              onClick={() => handleSetTimeFrame("1M")}
              style={{
                textDecoration:
                  currentTimeframe === "1M" ? "underline" : "none",
              }}
            >
              1M
            </li>
            <li
              onClick={() => handleSetTimeFrame("3M")}
              style={{
                textDecoration:
                  currentTimeframe === "3M" ? "underline" : "none",
              }}
            >
              3M
            </li>
            <li
              onClick={() => handleSetTimeFrame("6M")}
              style={{
                textDecoration:
                  currentTimeframe === "6M" ? "underline" : "none",
              }}
            >
              6M
            </li>
            <li
              onClick={() => handleSetTimeFrame("1Y")}
              style={{
                textDecoration:
                  currentTimeframe === "1Y" ? "underline" : "none",
              }}
            >
              1Y
            </li>
            <li
              onClick={() => handleSetTimeFrame("3Y")}
              style={{
                textDecoration:
                  currentTimeframe === "3Y" ? "underline" : "none",
              }}
            >
              3Y
            </li>
            <li
              onClick={() => handleSetTimeFrame("5Y")}
              style={{
                textDecoration:
                  currentTimeframe === "5Y" ? "underline" : "none",
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
