import { ConfigProvider, Select, theme } from "antd";
import { useState } from "react";
import "./Dropdown.css";

const Dropdown: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  const handleSelectChange = (value: string[]) => {
    setCount(count + 1);
  };

  return (
    <div className="dropdownContainer">
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <Select
          style={{ width: 200 }}
          mode="multiple"
          defaultValue={["Select All"]}
          placeholder="Show All"
          onChange={handleSelectChange}
          options={[
            {
              label: "Select All",
              value: "Select All",
            },
            {
              label: "Gainers",
              value: "Gainers",
            },
            {
              label: "Losers",
              value: "Losers",
            },
            {
              label: "Hot",
              value: "Host",
            },
            {
              label: "Our Picks",
              value: "Our Picks",
            },
          ]}
        />
      </ConfigProvider>

      {count > 0 && count < 9 && <div className="dropdownCount">+{count}</div>}
      {count >= 9 && <div className="dropdownCount">{count}+</div>}
    </div>
  );
};

export default Dropdown;
