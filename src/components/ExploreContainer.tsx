import { IonTitle } from "@ionic/react";
import { ConfigProvider, Table, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import "./ExploreContainer.css";

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
}

interface ContainerProps {}

const ExploreContainer: React.FC<ContainerProps> = () => {
  const [data, setData] = useState(null);
  const [watchIds, setWatchIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [timeframe, setTimeframe] = useState("1M");

  const columns: ColumnsType<DataType> = [
    {
      title: "Watch",
      dataIndex: "image_url",
      key: "image_url",
      render: (image_url) => {
        return <img src={image_url} width={150} />;
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
        const currentAnalytics = Object.keys(global_analytics).find(
          (childKey) => childKey.includes(timeframe.toLocaleLowerCase())
        );
        return global_analytics[currentAnalytics as string].open;
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
        return global_analytics[currentAnalytics as string].low;
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
        return global_analytics[currentAnalytics as string].high;
      },
    },
    {
      title: "+/- Change",
      dataIndex: "change",
      key: "change",
      // sorter: (a, b) => {
      //   const currentAnalytics = Object.keys(a.global_analytics).find(
      //     (childKey) => childKey.includes(timeframe.toLocaleLowerCase())
      //   );
      //   const _a = a.global_analytics[currentAnalytics as string];
      //   const _b = b.global_analytics[currentAnalytics as string];
      //   return parseFloat(_a.open as string) - parseFloat(_b.open as string);
      // },
    },
    {
      title: "Percent",
      dataIndex: "percent",
      key: "percent",
    },
    {
      title: "Chart",
      dataIndex: "percent",
      key: "percent",
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
        .then((data) => {
          const ids = data.map((o: any) => o.id);
          setData(data);
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
        const response = await fetch(
          `https://api-dev.horodex.io/watch_data/api/v1/watchutility?watch_ids=${id}&start=2023-05-01&end=2023-08-01&limit=-1&page=-1&orderBy=related_day&direction=asc`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        localStorage.setItem(data[0].watch.id, JSON.stringify(data[0]));
        return data;
      } catch (error) {
        console.error("Error fetching data for ID:", id, error);
        return null;
      }
    };

    // Make API calls for each ID
    Promise.all(watchIds.map((id) => fetchDataForWatchId(id)));
  }, [watchIds]);

  return (
    <div className="container">
      <div className="exploreContainer">
        <ul className="exploreNav">
          <li>
            <IonTitle>Discover</IonTitle>
          </li>
          <li className="trending">
            <IonTitle>Trending</IonTitle>
          </li>
        </ul>
        <div className="graphFilter">
          <Dropdown />
          <ul className="timeFilter">
            <li
              onClick={() => setTimeframe("1M")}
              style={{
                textDecoration: timeframe === "1M" ? "underline" : "none",
              }}
            >
              1M
            </li>
            <li
              onClick={() => setTimeframe("3M")}
              style={{
                textDecoration: timeframe === "3M" ? "underline" : "none",
              }}
            >
              3M
            </li>
            <li
              onClick={() => setTimeframe("6M")}
              style={{
                textDecoration: timeframe === "6M" ? "underline" : "none",
              }}
            >
              6M
            </li>
            <li
              onClick={() => setTimeframe("1Y")}
              style={{
                textDecoration: timeframe === "1Y" ? "underline" : "none",
              }}
            >
              1Y
            </li>
            <li
              onClick={() => setTimeframe("3Y")}
              style={{
                textDecoration: timeframe === "3Y" ? "underline" : "none",
              }}
            >
              3Y
            </li>
            <li
              onClick={() => setTimeframe("5Y")}
              style={{
                textDecoration: timeframe === "5Y" ? "underline" : "none",
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
            columns={columns}
            dataSource={data || []}
            rowSelection={{}}
            expandable={{
              expandRowByClick: true,
              expandedRowRender: (record) => {
                // console.log("record", record);
                return null;
              },
              // rowExpandable: (record) => {
              //   return true;
              // },
            }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default ExploreContainer;
