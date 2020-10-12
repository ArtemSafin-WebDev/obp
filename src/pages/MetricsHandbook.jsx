import React, { useState, useCallback } from "react";
import { Route, Switch, Link } from "react-router-dom";
import CreateMetric from "../components/CreateMetric";
import MetricsList from "../components/MetricsList";

const MetricsHandbook = ({ match }) => {
  const [metrics, setMetrics] = useState([
    {
      id: 1,
      name: "Общее количество созданных обращений",
      description: "S",
      type: "Количественный",
      locked: false,
    },
    {
      id: 2,
      name: "Общее время телефонных разговоров",
      description: "Tz",
      type: "Временной",
      locked: true,
    },
    {
      id: 3,
      name: "Средняя длительность телефонного разговора",
      description: "Tsz",
      type: "Показатель",
      locked: false,
    },
  ]);

  console.log("Match", match);

  const removeMetric = useCallback(() => {}, []);
  const addMetric = useCallback(() => {}, []);

  return (
    <div className="page">
      <h2 className="page-heading">Справочник показателей / метрик</h2>
      <div className="page-metrics-list-controls">
        <Link
          className="page-metrics-list-controls-item"
          to={`${match.url}/create`}
          draggable="false"
        >
          Добавить
        </Link>
        <button className="page-metrics-list-controls-item">
          Удалить
        </button>
        <button className="page-metrics-list-controls-item">
          Импорт
        </button>
      </div>
      <Switch>
        <Route path={`${match.path}/create`}>
          <CreateMetric addMetric={addMetric} />
        </Route>
        <Route path={`${match.path}`}>
          <MetricsList metrics={metrics} />
        </Route>
      </Switch>
    </div>
  );
};

export default MetricsHandbook;
