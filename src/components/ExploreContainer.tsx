import { IonTitle } from "@ionic/react";
import { ConfigProvider, Table, Tag, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import {
  formatToPercentage,
  formatUSD,
  getCurrentDateFormatted,
  getDateDaysAgo,
  getDaysAgo,
} from "../utils/helpers";
import Dropdown from "./Dropdown";
import "./ExploreContainer.css";
import WatchDetails from "./WatchDetails";

interface DataType {
  key: string;
  watch: string;
  model: string;
  reference: string;
  marketValue: string;
  low: string;
  high: string;
  change: string;
  percent: string;
  chart: string;
  global_analytics: any;
  id: string;
}

interface ContainerProps {}

const ExploreContainer: React.FC<ContainerProps> = () => {
  const [data, setData] = useState(null);
  const [watchIds, setWatchIds] = useState([]);
  const [timeframe, setTimeframe] = useState("1M");

  const past = getDateDaysAgo(30);

  const [pastDate, setPastDate] = useState<string>(past);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const onExpand = (expanded: boolean, record: DataType) => {
    const keys = expanded
      ? [...expandedRowKeys, record.key]
      : expandedRowKeys.filter((key) => key !== record.key);
    setExpandedRowKeys(keys);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Watch",
      dataIndex: "image_url",
      key: "image_url",
      render: (image_url) => {
        return <img src={image_url} width={150} alt="watch image" />;
      },
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      render: (model) => {
        return (
          <>
            <strong>{model.manufacturer}</strong>
            <br />
            <>{model.model_name}</>
          </>
        );
      },
    },
    {
      title: "Reference",
      dataIndex: "reference_number",
      key: "reference",
    },
    {
      title: "Market Value",
      dataIndex: "global_analytics",
      key: "marketValue",
      sorter: (a, b) => {
        const currentAnalytics = Object.keys(a.global_analytics).find(
          (childKey) => childKey.includes(timeframe.toLocaleLowerCase())
        );
        const _a = a.global_analytics[currentAnalytics as string];
        const _b = b.global_analytics[currentAnalytics as string];
        return parseFloat(_a.open as string) - parseFloat(_b.open as string);
      },
      render: (global_analytics) => {
        // 1 day close
        return (
          <Tag color="gold-inverse">
            {formatUSD(parseFloat(global_analytics.analytics_1d.close))}
          </Tag>
        );
      },
    },
    {
      title: "Low",
      dataIndex: "global_analytics",
      key: "low",
      sorter: (a, b) => {
        const currentAnalytics = Object.keys(a.global_analytics).find(
          (childKey) => childKey.includes(timeframe.toLocaleLowerCase())
        );
        const _a = a.global_analytics[currentAnalytics as string];
        const _b = b.global_analytics[currentAnalytics as string];
        return parseFloat(_a.low as string) - parseFloat(_b.low as string);
      },
      render: (global_analytics) => {
        const currentAnalytics = Object.keys(global_analytics).find(
          (childKey) => childKey.includes(timeframe.toLocaleLowerCase())
        );

        return formatUSD(
          parseFloat(global_analytics[currentAnalytics as string].low)
        );
      },
    },
    {
      title: "High",
      dataIndex: "global_analytics",
      key: "high",
      sorter: (a, b) => {
        const currentAnalytics = Object.keys(a.global_analytics).find(
          (childKey) => childKey.includes(timeframe.toLocaleLowerCase())
        );
        const _a = a.global_analytics[currentAnalytics as string];
        const _b = b.global_analytics[currentAnalytics as string];
        return parseFloat(_a.high as string) - parseFloat(_b.high as string);
      },
      render: (global_analytics) => {
        const currentAnalytics = Object.keys(global_analytics).find(
          (childKey) => childKey.includes(timeframe.toLocaleLowerCase())
        );
        return formatUSD(
          parseFloat(global_analytics[currentAnalytics as string].high)
        );
      },
    },
    {
      // respective timeframe close - open
      title: "+/-Change",
      dataIndex: "global_analytics",
      key: "change",
      sorter: (a, b) => {
        const currentAnalytics = Object.keys(a.global_analytics).find(
          (childKey) => childKey.includes(timeframe.toLocaleLowerCase())
        );
        const _a = a.global_analytics[currentAnalytics as string];
        const _b = b.global_analytics[currentAnalytics as string];
        const result =
          parseFloat(_a.close) -
          parseFloat(_a.open) -
          (parseFloat(_b.close) - parseFloat(_b.open));
        return result;
      },
      render: (global_analytics) => {
        const currentAnalytics = Object.keys(global_analytics).find(
          (childKey) => childKey.includes(timeframe.toLocaleLowerCase())
        );
        const timeframeAnalytics = global_analytics[currentAnalytics as string];
        const result = formatUSD(
          parseFloat(timeframeAnalytics.close) -
            parseFloat(timeframeAnalytics.open)
        );
        const changeColor =
          parseFloat(timeframeAnalytics.close) -
            parseFloat(timeframeAnalytics.open) <
          0
            ? "red"
            : "green";

        return <strong style={{ color: changeColor }}>{result}</strong>;
      },
    },
    {
      // respective timeframe (close - open) / open
      title: "Percent",
      dataIndex: "global_analytics",
      key: "percent",
      sorter: (a, b) => {
        const currentAnalytics = Object.keys(a.global_analytics).find(
          (childKey) => childKey.includes(timeframe.toLocaleLowerCase())
        );
        const _a = a.global_analytics[currentAnalytics as string];
        const _b = b.global_analytics[currentAnalytics as string];
        const result =
          (_a.close - _a.open) / _a.open - (_b.close - _b.open) / _b.open;
        return result;
      },
      render: (global_analytics) => {
        const currentAnalytics = Object.keys(global_analytics).find(
          (childKey) => childKey.includes(timeframe.toLocaleLowerCase())
        );
        const timeframeAnalytics = global_analytics[currentAnalytics as string];
        const result =
          (parseFloat(timeframeAnalytics.close) -
            parseFloat(timeframeAnalytics.open)) /
          parseFloat(timeframeAnalytics.open);

        const tagColor = result < 0 ? "red" : "green";
        return <Tag color={tagColor}>{formatToPercentage(result)}</Tag>;
      },
    },
    {
      title: "Chart",
      dataIndex: "global_analytics",
      key: "chart",
      render: (global_analytics) => {
        const currentAnalytics = Object.keys(global_analytics).find(
          (childKey) => childKey.includes(timeframe.toLocaleLowerCase())
        );
        const timeframeAnalytics = global_analytics[currentAnalytics as string];
        const resultForColor =
          (parseFloat(timeframeAnalytics.close) -
            parseFloat(timeframeAnalytics.open)) /
          parseFloat(timeframeAnalytics.open);

        const chartColor = resultForColor < 0 ? "#FF0000" : "#00FF00";

        const item = localStorage.getItem(global_analytics.watch_id);
        if (item === null) {
          return;
        }

        const result = JSON.parse(item);
        const xAxisCategories = result.daily_analytics;
        const data = result.daily_analytics.map((o: any) => o.price);

        return (
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
                enabled: false,
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
        );
      },
    },
  ];

  useEffect(() => {
    const url =
      "https://api-dev.horodex.io/watch_data/api/v1/watches/search/suggested";

    try {
      fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((data: any) => {
          const ids = data.map((o: any) => o.id);
          localStorage.setItem("watchData", JSON.stringify(data));
          const mappedData = data.map((o: any, i: number) => {
            return {
              ...o,
              key: i,
            };
          });
          setData(mappedData);
          setWatchIds(ids);
        });

      // Handle the fetched data
    } catch (error) {
      // Handle errors
    }
  }, []);

  useEffect(() => {
    if (watchIds.length === 0) return;

    // Function to fetch data for a given ID, write it local storage
    const fetchDataForWatchId = async (id: string) => {
      try {
        const today = getCurrentDateFormatted();
        const response = await fetch(
          `https://api-dev.horodex.io/watch_data/api/v1/watchutility?watch_ids=${id}&start=${pastDate}&end=${today}&limit=-1&page=-1&orderBy=related_day&direction=asc`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        const writeWatchData = JSON.stringify(data[0]);
        localStorage.setItem(data[0].watch.id, writeWatchData);
        return data;
      } catch (error) {
        console.error("Error fetching data for ID:", id, error);
        return null;
      }
    };

    // Make API calls for each ID
    Promise.all(watchIds.map((id) => fetchDataForWatchId(id)));
  }, [watchIds]);

  const handleSetTimeFrame = (timeframe: string): void => {
    setTimeframe(timeframe);
    const days = getDaysAgo(timeframe);
    const pastDate = getDateDaysAgo(days);
    setPastDate(pastDate);
  };

  return (
    <div className="container">
      <div className="exploreContainer">
        <ul className="exploreNav">
          <li>
            <IonTitle>Discover</IonTitle>
          </li>
          <li className="trending">
            <IonTitle style={{ fontWeight: "bolder" }}>Trending</IonTitle>
          </li>
        </ul>
        <div className="graphFilter">
          <Dropdown />
          <ul className="timeFilter">
            <li
              onClick={() => handleSetTimeFrame("1M")}
              style={{
                textDecoration: timeframe === "1M" ? "underline" : "none",
                color: timeframe === "1M" ? "white" : "light-grey",
                fontWeight: timeframe === "1M" ? "bolder" : 100,
              }}
            >
              1M
            </li>
            <li
              onClick={() => handleSetTimeFrame("3M")}
              style={{
                textDecoration: timeframe === "3M" ? "underline" : "none",
                color: timeframe === "3M" ? "white" : "light-grey",
                fontWeight: timeframe === "3M" ? "bolder" : 100,
              }}
            >
              3M
            </li>
            <li
              onClick={() => handleSetTimeFrame("6M")}
              style={{
                textDecoration: timeframe === "6M" ? "underline" : "none",
                color: timeframe === "6M" ? "white" : "light-grey",
                fontWeight: timeframe === "6M" ? "bolder" : 100,
              }}
            >
              6M
            </li>
            <li
              onClick={() => handleSetTimeFrame("1Y")}
              style={{
                textDecoration: timeframe === "1Y" ? "underline" : "none",
                color: timeframe === "1Y" ? "white" : "light-grey",
                fontWeight: timeframe === "1Y" ? "bolder" : 100,
              }}
            >
              1Y
            </li>
            <li
              onClick={() => handleSetTimeFrame("3Y")}
              style={{
                textDecoration: timeframe === "3Y" ? "underline" : "none",
                color: timeframe === "3Y" ? "white" : "light-grey",
                fontWeight: timeframe === "3Y" ? "bolder" : 100,
              }}
            >
              3Y
            </li>
            <li
              onClick={() => handleSetTimeFrame("5Y")}
              style={{
                textDecoration: timeframe === "5Y" ? "underline" : "none",
                color: timeframe === "5Y" ? "white" : "light-grey",
                fontWeight: timeframe === "5Y" ? "bolder" : 100,
              }}
            >
              5Y
            </li>
          </ul>
        </div>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >
          <Table
            rowKey={"key"}
            columns={columns}
            dataSource={data || []}
            rowSelection={{}}
            expandable={{
              expandRowByClick: true,
              expandedRowKeys: expandedRowKeys,
              onExpand: onExpand,
              expandedRowRender: (record) => {
                const item = localStorage.getItem(record.id);
                if (item === null) {
                  // Handle the case where the item is not found. You might return null or a placeholder.
                  console.log("Item not found in localStorage");
                  return null; // or <PlaceholderComponent /> or any other fallback UI
                }

                try {
                  const watchData = JSON.parse(item);
                  return (
                    <WatchDetails watchData={watchData} timeframe={timeframe} />
                  );
                } catch (error) {
                  // Handle JSON parsing error
                  console.log("Error parsing JSON from localStorage", error);
                  return null; // or <ErrorComponent /> or any other fallback UI
                }
              },
            }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default ExploreContainer;
