import React, { Component } from "react";
import moment from "moment";
import Select from "react-select";
import { Chart } from "react-google-charts";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from "react-day-picker/moment";

import "moment/locale/ru";
import getClaimsDynamicsByTypeData from "../api/getClaimsDynamicsByType";

const detailOptions = [
  { value: "day", label: "По дням" },
  { value: "week", label: "По неделям" },
];

const statusOptions = [
  { value: 0, label: "Открыто" },
  { value: 5, label: "Закрыто" },
  { value: 10, label: "Создано" },
];

const moduleOptions = [
  { value: 1, label: "Все" },
  { value: 2, label: "Все кроме УНП" },
];

const chartOptions = {
  isStacked: true,
  backgroundColor: "#edeef0",
  bar: {
    groupWidth: "20%",
  },
  colors: ["#f4c225", "#d7874c", "#e4a232"],
  fontSize: 14,
  fontName: "Roboto",
  legend: {
    position: "bottom",
  },
};

const columnNames = [["Тип", "Консультация", "Инцидент"]];

const FORMAT = "YYYY-MM-DD";

class ClaimsDynamicsByType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      period: "week",
      startDate: moment(new Date()).subtract(1, "months").format(FORMAT),
      endDate: moment(new Date()).format(FORMAT),
      detail: detailOptions[0],
      data: [],
      chartId: 102,
      module: moduleOptions[0],
      loading: false,
      error: false,
      errorMessage: "",
      status: statusOptions[0],
    };
  }

  handleRadioChange = (event) => {
    this.setState({
      period: event.target.value,
    });
    this.loadData();
  };

  handleStartDateChange = (day) => {
    this.setState({ startDate: moment(day).format(FORMAT) });
    this.loadData();
  };
  handleEndDateChange = (day) => {
    this.setState({ endDate: moment(day).format(FORMAT) });
    this.loadData();
  };

  handleDetalizationChange = (selectedOption) => {
    this.setState({ detail: selectedOption });
    this.loadData();
  };
  handleModuleChange = (selectedOption) => {
    this.setState({ module: selectedOption });
    this.loadData();
  };
  handleStatusChange = (selectedOption) => {
    this.setState({ status: selectedOption });
    this.loadData();
  };

  loadData = async () => {
    this.setState({ loading: true });
    let response;
    try {
      response = await getClaimsDynamicsByTypeData(
        this.state.chartId,
        this.state.startDate,
        this.state.endDate,
        this.state.module.value,
        this.state.detail.value,
        this.state.status.value
      );
      console.log("Response", response);
      this.setState({
        loading: false,
        data: columnNames.concat(response.data),
      });
    } catch (err) {
      this.setState({ loading: false, error: true, errorMessage: err.message });
    }
  };

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <div className="page">
        <h2 className="page-heading">Динамика обращений по типу</h2>

        <form className="graph-filters">
          <div className="graph-period">
            <label className="graph-period-radio">
              <input
                type="radio"
                value="week"
                name="period"
                className="graph-period-radio-input"
                onChange={this.handleRadioChange}
                checked={this.state.period === "week"}
              />
              <span className="graph-period-radio-text">Неделя</span>
            </label>
            <label className="graph-period-radio">
              <input
                type="radio"
                value="month"
                name="period"
                className="graph-period-radio-input"
                onChange={this.handleRadioChange}
                checked={this.state.period === "month"}
              />
              <span className="graph-period-radio-text">Месяц</span>
            </label>
            <label className="graph-period-radio">
              <input
                type="radio"
                value="range"
                name="period"
                className="graph-period-radio-input"
                onChange={this.handleRadioChange}
                checked={this.state.period === "range"}
              />
              <span className="graph-period-radio-text">Период</span>
            </label>
          </div>

          <div className="graph-filters-dates-range">
            <div className="graph-filters-dates-range-picker">
              <div className="graph-filters-dates-range-picker-label">с:</div>
              <div className="graph-filters-dates-range-picker-wrapper">
                <DayPickerInput
                  dayPickerProps={{
                    locale: "ru",
                    localeUtils: MomentLocaleUtils,
                  }}
                  formatDate={formatDate}
                  parseDate={parseDate}
                  format={FORMAT}
                  placeholder={FORMAT}
                  onDayChange={this.handleStartDateChange}
                  value={this.state.startDate}
                />
              </div>
            </div>
            <div className="graph-filters-dates-range-picker">
              <div className="graph-filters-dates-range-picker-label">по:</div>
              <div className="graph-filters-dates-range-picker-wrapper">
                <DayPickerInput
                  dayPickerProps={{
                    locale: "ru",
                    localeUtils: MomentLocaleUtils,
                  }}
                  formatDate={formatDate}
                  parseDate={parseDate}
                  format={FORMAT}
                  placeholder={FORMAT}
                  onDayChange={this.handleEndDateChange}
                  value={this.state.endDate}
                />
              </div>
            </div>
          </div>
          <div className="graph-filters-dates-select">
            <div className="graph-filters-dates-select-label">Детализация</div>
            <div className="graph-filters-dates-select-wrapper">
              <Select
                value={this.state.detail}
                onChange={this.handleDetalizationChange}
                options={detailOptions}
              />
            </div>
          </div>
          <div className="graph-filters-dates-select">
            <div className="graph-filters-dates-select-label">Статус</div>
            <div className="graph-filters-dates-select-wrapper">
              <Select
                value={this.state.status}
                onChange={this.handleStatusChange}
                options={statusOptions}
              />
            </div>
          </div>
          <div className="graph-filters-dates-select">
            <div className="graph-filters-dates-select-label">Модуль</div>
            <div className="graph-filters-dates-select-wrapper">
              <Select
                value={this.state.module}
                onChange={this.handleModuleChange}
                options={moduleOptions}
              />
            </div>
          </div>
        </form>

        <div className="chart">
          {this.state.loading ? (
            <div className="loader">Загрузка...</div>
          ) : (
            <div className="loader">
              {this.state.error
                ? `Произошла ошибка: ${this.state.errorMessage}`
                : null}
            </div>
          )}

          <div className="chart-container">
            {!this.state.loading && !this.state.error && (
              <Chart
                width={"100%"}
                height={"700px"}
                chartType="ColumnChart"
                loader={<div className="loader">Загрузка графика...</div>}
                data={this.state.data}
                options={chartOptions}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ClaimsDynamicsByType;
