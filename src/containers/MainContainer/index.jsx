import { useEffect, useState } from "react";
import axios from "axios";
import "./index.scss";

export default function MainContainer() {
  const [toggleData, setToggleData] = useState(false);
  const [data, setData] = useState([]);

  console.log(process.env.ENV_VARS.ENV_API_MOCK_DATA_EXAMPLE);

  useEffect(() => {
    const loadData = async () => {
      let apiUrl = process.env.ENV_VARS.ENV_API_MOCK_DATA_EXAMPLE;
      let response = await axios({ url: apiUrl, method: "GET" });
      setData(response.data.results);
      console.log(response.data);
    };
    loadData();
  }, []);

  return (
    <div className="MainContainer">
      <button onClick={() => setToggleData(!toggleData)}>Toggle Data</button>
      <ul>
        {toggleData
          ? data &&
            data.map((item) => (
              <li key={item.id}>
                <span><b>{item.title}</b></span> 
                <span>{item.content}</span>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
