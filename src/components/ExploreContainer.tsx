import { IonTitle } from "@ionic/react";
import { ConfigProvider, Table, Tag, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
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
  id: string;
}

interface ContainerProps {}

const ExploreContainer: React.FC<ContainerProps> = () => {
  const [data, setData] = useState(null);
  const [watchIds, setWatchIds] = useState([]);
  const [timeframe, setTimeframe] = useState("1M");
  const [pastDaysCount, setPastDaysCount] = useState<number>(30);
  const [pastDate, setPastDate] = useState<string>("");
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
          throw new Error("NO");
        }

        const result = JSON.parse(item);
        const xAxisCategories = result.daily_analytics; // just need to reverse order
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
        localStorage.setItem(data[0].watch.id, JSON.stringify(data[0]));
        return data;
      } catch (error) {
        console.error("Error fetching data for ID:", id, error);
        return null;
      }
    };

    // Make API calls for each ID
    Promise.all(watchIds.map((id) => fetchDataForWatchId(id)));
  }, [watchIds, timeframe]);

  const formatUSD = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      // You can add more options as needed
    }).format(amount);
  };

  const formatToPercentage = (value: number): string => {
    const percentage = (value * 100).toFixed(2);
    return `${percentage}%`;
  };

  const getCurrentDateFormatted = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Month is zero-based, add 1 to get the correct month
    const day = now.getDate();

    // Pad the month and day with a leading zero if they are less than 10
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const getDateDaysAgo = (days: number): string => {
    const today = new Date();
    today.setDate(today.getDate() - days);

    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Month is zero-based, add 1 to get the correct month
    const day = today.getDate();

    // Pad the month and day with a leading zero if they are less than 10
    const formattedMonth = month < 10 ? `0${month}` : month.toString();
    const formattedDay = day < 10 ? `0${day}` : day.toString();

    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const getDaysAgo = (timeframe?: string): number => {
    switch (timeframe) {
      case "1M":
        return 30;
      case "3M":
        return 90;
      case "6M":
        return 180;
      case "1Y":
        return 365;
      case "3Y":
        return 1095;
      case "5Y":
        return 1825;
      default:
        return 30;
    }
  };

  const handleSetTimeFrame = (timeframe: string): void => {
    setTimeframe(timeframe);
    const days = getDaysAgo(timeframe);
    setPastDaysCount(days);
    const pastDate = getDateDaysAgo(days);
    setPastDate(pastDate);
  };

  console.log("fuck yeah", timeframe, pastDaysCount, pastDate);
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
              onClick={() => handleSetTimeFrame("1M")}
              style={{
                textDecoration: timeframe === "1M" ? "underline" : "none",
              }}
            >
              1M
            </li>
            <li
              onClick={() => handleSetTimeFrame("3M")}
              style={{
                textDecoration: timeframe === "3M" ? "underline" : "none",
              }}
            >
              3M
            </li>
            <li
              onClick={() => handleSetTimeFrame("6M")}
              style={{
                textDecoration: timeframe === "6M" ? "underline" : "none",
              }}
            >
              6M
            </li>
            <li
              onClick={() => handleSetTimeFrame("1Y")}
              style={{
                textDecoration: timeframe === "1Y" ? "underline" : "none",
              }}
            >
              1Y
            </li>
            <li
              onClick={() => handleSetTimeFrame("3Y")}
              style={{
                textDecoration: timeframe === "3Y" ? "underline" : "none",
              }}
            >
              3Y
            </li>
            <li
              onClick={() => handleSetTimeFrame("5Y")}
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
                  throw new Error("oh no");
                }
                const watchData = JSON.parse(item);
                console.log("watchData", watchData);
                return (
                  <div className="detailsContainer">
                    <div className="details">Details</div>
                    <div className="detailsChart">Chart</div>
                  </div>
                );
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
