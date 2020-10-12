import React from "react";
import { ReactComponent as OpenLock } from "../icons/open-lock.svg";
import { ReactComponent as ClosedLock } from "../icons/lock.svg";
import "./MetricsList.scss";

const MetricsList = ({ metrics }) => {
  return (
    <div className="metrics-list">
      <table className="metrics-list-table">
        <thead>
          <tr>
            <th>Наименование</th>
            <th>Обозначение</th>
            <th>Тип</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {metrics.length ? (
            metrics.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.type}</td>
                <td>
                  {item.locked ? (
                    <ClosedLock
                      className="metrics-list-lock-icon"
                      width="18"
                      height="18"
                    />
                  ) : (
                    <OpenLock
                      className="metrics-list-lock-icon"
                      width="18"
                      height="18"
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <div className="no-metrics">Метрики отсутствуют</div>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MetricsList;
