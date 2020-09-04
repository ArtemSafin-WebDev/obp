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
  { value: "OPENED", label: "Открыто" },
  { value: "CLOSED", label: "Закрыто" },
  { value: "CREATED", label: "Создано" },
];

const chartOptions = {
  isStacked: true,
  backgroundColor: "#edeef0",
  bar: {
    groupWidth: "20%",
  },
  colors: ["#d7874c", "#f4c225"],
  fontSize: 14,
  fontName: "Roboto",
  legend: {
    position: "bottom",
  },
  curveType: 'function',
};

const columnNames = [["Тип", "Инцидент", "Консультация"]];

const FORMAT = "YYYY-MM-DD";

class ClaimsDynamicsByType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      period: "week",
      startDate: moment(new Date()).subtract(8, "days").format(FORMAT),
      endDate: moment(new Date()).subtract(1, "days").format(FORMAT),
      detail: detailOptions[0],
      data: [],
      chartType: "CLAIMS_BY_TYPE",
      module: { value: 1, label: "Все" },
      loading: false,
      error: false,
      errorMessage: "",
      status: statusOptions[0],
    };
  }

  handleRadioChange = (event) => {
    this.setState(
      {
        period: event.target.value,
      },
      () => {
        if (this.state.period === "week") {
          this.setState(
            {
              startDate: moment(new Date()).subtract(8, "days").format(FORMAT),
              endDate: moment(new Date()).subtract(1, "days").format(FORMAT),
              detail: detailOptions[0],
            },
            () => this.loadData()
          );
        } else if (this.state.period === "month") {
          this.setState(
            {
              startDate: moment(new Date())
                .subtract(1, "days")
                .subtract(1, "months")
                .format(FORMAT),
              endDate: moment(new Date()).subtract(1, "days").format(FORMAT),
              detail: detailOptions[1],
            },
            () => this.loadData()
          );
        } else {
          this.setState(
            {
              detail: detailOptions[1],
            },
            () => this.loadData()
          );
        }
      }
    );
  };

  handleStartDateChange = (day) => {
    if (moment(this.state.endDate).diff(day, "days") < 0) {
      this.setState(
        {
          startDate: moment(day).format(FORMAT),
          endDate: moment(day).format(FORMAT),
          period: "range",
        },
        () => this.loadData()
      );
    } else {
      this.setState(
        { startDate: moment(day).format(FORMAT), period: "range" },
        () => this.loadData()
      );
    }
  };
  handleEndDateChange = (day) => {
    if (moment(day).diff(this.state.startDate, "days") < 0) {
      this.setState(
        {
          startDate: moment(day).format(FORMAT),
          endDate: moment(day).format(FORMAT),
          period: "range",
        },
        () => this.loadData()
      );
    } else {
      this.setState(
        { endDate: moment(day).format(FORMAT), period: "range" },
        () => this.loadData()
      );
    }
  };

  handleDetalizationChange = (selectedOption) => {
    this.setState({ detail: selectedOption }, () => this.loadData());
  };
  handleModuleChange = (selectedOption) => {
    this.setState({ module: selectedOption }, () => this.loadData());
  };
  handleStatusChange = (selectedOption) => {
    this.setState({ status: selectedOption }, () => this.loadData());
  };

  loadData = async () => {
    this.setState({ loading: true });
    let response;

    try {
      response = await getClaimsDynamicsByTypeData(
        this.state.chartType,
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
        error: false,
        errorMessage: "",
      });
    } catch (err) {
      this.setState({ loading: false, error: true, errorMessage: err.message });
    }
  };

  componentDidMount() {
    this.loadData();
  }

  render() {
    const modules = this.props.modules.map((module) => ({
      value: module[0],
      label: module[1],
    }));

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
                  inputProps={{
                    readOnly: "readonly",
                  }}
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
                  inputProps={{
                    readOnly: "readonly",
                  }}
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
                options={modules}
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
