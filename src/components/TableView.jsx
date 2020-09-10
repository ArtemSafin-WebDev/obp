import React from "react";
import "./TableView.scss";

function TableView({ data, colors }) {
  console.log("Data for table view", data);

  if (!data.length) return null;

  const numberOfRows = Object.keys(data[0]);
  console.log("Number of rows", numberOfRows);
  console.log('Colors', colors)
  return (
    <div className="table-view">
      <table className="table-view-table">
        <tbody>
          {numberOfRows.map((row) => (
            <tr className="table-view-table-row" key={row}>
              {data.map((dataItem, dataItemIndex) => (
                <td key={row + dataItemIndex} className="table-view-table-data" >
                  {dataItem[row]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;
