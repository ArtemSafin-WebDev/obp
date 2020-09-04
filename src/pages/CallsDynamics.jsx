import React, { Component } from "react";
import moment from "moment";

import { Chart } from "react-google-charts";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from "react-day-picker/moment";

import "moment/locale/ru";

import getCalls from "../api/getCalls";

const chartOptions = {
  isStacked: true,
  backgroundColor: "#edeef0",
  bar: {
    groupWidth: "40%",
  },
  colors: ["#dc8f8f", "#9ad59f"],
  fontSize: 14,
  fontName: "Roboto",
  legend: {
    position: "bottom",
  },
  curveType: 'function',
};

const columnNames = [["Дата", "Пропущено", "Принято"]];

const FORMAT = "YYYY-MM-DD";

// const firstDate = moment(new Date()).subtract(8, "days").format(FORMAT);
// const secondDate = moment(new Date()).subtract(1, "days").format(FORMAT)
// console.log('Test difference between dates', moment(secondDate).diff(firstDate, 'days'))

class CallsDynamics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      period: "day",
      startDate: moment(new Date()).subtract(1, "days").format(FORMAT),
      endDate: moment(new Date()).subtract(1, "days").format(FORMAT),
      detail: "hour",
      data: [],
      chartType: "CALLS",

      loading: false,
      error: false,
      errorMessage: "",
    };
  }

  handleRadioChange = (event) => {
    this.setState(
      {
        period: event.target.value,
      },
      () => {
        if (this.state.period === "day") {
          this.setState(
            {
              startDate: moment(new Date()).subtract(1, "days").format(FORMAT),
              endDate: moment(new Date()).subtract(1, "days").format(FORMAT),
              detail: "hour",
            },
            () => this.loadData()
          );
        } else if (this.state.period === "week") {
          this.setState(
            {
              startDate: moment(new Date()).subtract(8, "days").format(FORMAT),
              endDate: moment(new Date()).subtract(1, "days").format(FORMAT),
              detail: "day",
            },
            () => this.loadData()
          );
        } else {
          this.setState(
            {
              startDate: moment(new Date())
                .subtract(1, "days")
                .subtract(1, "months")
                .format(FORMAT),
              endDate: moment(new Date()).subtract(1, "days").format(FORMAT),
              detail: "day",
            },
            () => this.loadData()
          );
        }
      }
    );
  };

  handleStartDateChange = (day) => {
    console.log("Start date", day);
    if (this.state.period === "day") {
      this.setState(
        {
          startDate: moment(day).format(FORMAT),
          endDate: moment(day).format(FORMAT),
        },
        () => this.loadData()
      );
    } else if (this.state.period === "week") {
      if (moment(this.state.endDate).diff(day, "days") > 14) {
        this.setState(
          {
            startDate: moment(day).format(FORMAT),
            detail: "day",
            period: "range",
          },
          () => this.loadData()
        );
      } else if (moment(this.state.endDate).diff(day, "days") === 0) {
        this.setState(
          {
            startDate: moment(day).format(FORMAT),
            detail: "hour",
            period: "day",
          },
          () => this.loadData()
        );
      } else if (moment(this.state.endDate).diff(day, "days") < 0) {
        this.setState(
          {
            startDate: moment(day).format(FORMAT),
            endDate: moment(day).format(FORMAT),
            detail: "hour",
            period: "day",
          },
          () => this.loadData()
        );
      } else {
        this.setState({ startDate: moment(day).format(FORMAT) }, () =>
          this.loadData()
        );
      }
    } else {
      if (
        moment(this.state.endDate).diff(day, "days") <= 7 &&
        moment(this.state.endDate).diff(day, "days") !== 0
      ) {
        this.setState(
          {
            startDate: moment(day).format(FORMAT),
            period: "week",
            detail: "day",
          },
          () => this.loadData()
        );
      } else if (moment(this.state.endDate).diff(day, "days") === 0) {
        this.setState(
          {
            startDate: moment(day).format(FORMAT),
            detail: "hour",
            period: "day",
          },
          () => this.loadData()
        );
      } else if (moment(this.state.endDate).diff(day, "days") < 0) {
        this.setState(
          {
            startDate: moment(day).format(FORMAT),
            endDate: moment(day).format(FORMAT),
            detail: "hour",
            period: "day",
          },
          () => this.loadData()
        );
      } else {
        this.setState({ startDate: moment(day).format(FORMAT) }, () =>
          this.loadData()
        );
      }
    }
  };
  handleEndDateChange = (day) => {
    if (this.state.period === "day") {
      this.setState(
        {
          startDate: moment(day).format(FORMAT),
          endDate: moment(day).format(FORMAT),
        },
        () => this.loadData()
      );
    } else if (this.state.period === "week") {
      if (
        moment(day).diff(this.state.startDate, "days") > 14 &&
        moment(day).diff(this.state.startDate, "days") !== 0
      ) {
        this.setState(
          {
            endDate: moment(day).format(FORMAT),
            detail: "day",
            period: "range",
          },
          () => this.loadData()
        );
      } else if (moment(day).diff(this.state.startDate, "days") === 0) {
        this.setState(
          {
            endDate: moment(day).format(FORMAT),
            detail: "hour",
            period: "day",
          },
          () => this.loadData()
        );
      } else if (moment(day).diff(this.state.startDate, "days") < 0) {
        this.setState(
          {
            startDate: moment(day).format(FORMAT),
            endDate: moment(day).format(FORMAT),
            detail: "hour",
            period: "day",
          },
          () => this.loadData()
        );
      } else {
        this.setState({ endDate: moment(day).format(FORMAT) }, () =>
          this.loadData()
        );
      }
    } else {
      if (
        moment(day).diff(this.state.startDate, "days") <= 7 &&
        moment(day).diff(this.state.startDate, "days") !== 0
      ) {
        this.setState(
          {
            endDate: moment(day).format(FORMAT),
            period: "week",
            detail: "day",
          },
          () => this.loadData()
        );
      } else if (moment(day).diff(this.state.startDate, "days") === 0) {
        this.setState(
          {
            endDate: moment(day).format(FORMAT),
            detail: "hour",
            period: "day",
          },
          () => this.loadData()
        );
      } else if (moment(day).diff(this.state.startDate, "days") < 0) {
        this.setState(
          {
            startDate: moment(day).format(FORMAT),
            endDate: moment(day).format(FORMAT),
            detail: "hour",
            period: "day",
          },
          () => this.loadData()
        );
      } else {
        this.setState({ endDate: moment(day).format(FORMAT) }, () =>
          this.loadData()
        );
      }
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

    let startDate = this.state.startDate;
    let endDate = this.state.endDate;

    if (this.state.period === "week") {
      startDate = moment(new Date()).subtract(8, "days").format(FORMAT);
      endDate = moment(new Date()).subtract(1, "days").format(FORMAT);
    } else if (this.state.period === "month") {
      startDate = moment(new Date()).subtract(1, "months").format(FORMAT);
      endDate = moment(new Date()).subtract(1, "days").format(FORMAT);
    }
    try {
      response = await getCalls(
        this.state.chartType,
        startDate,
        endDate,
        this.state.detail
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
    return (
      <div className="page">
        <h2 className="page-heading">Динамика звонков</h2>

        <form className="graph-filters">
          <div className="graph-period">
            <label className="graph-period-radio">
              <input
                type="radio"
                value="day"
                name="period"
                className="graph-period-radio-input"
                onChange={this.handleRadioChange}
                checked={this.state.period === "day"}
              />
              <span className="graph-period-radio-text">День</span>
            </label>
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

export default CallsDynamics;
