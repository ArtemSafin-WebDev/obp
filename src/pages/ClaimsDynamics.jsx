import React, { Component } from "react";
import moment from "moment";
import Select from "react-select";
import { Chart } from "react-google-charts";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { ReactComponent as Download } from "../icons/download.svg";
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from "react-day-picker/moment";

import "moment/locale/ru";
import getClaimsDynamicsData from "../api/getClaimsDynamics";
import TableView from "../components/TableView";

const detailOptions = [
  { value: "day", label: "По дням" },
  { value: "week", label: "По неделям" },
];

const chartOptions = {
  // title: "Динамика обращений",
  // vAxis: { title: "Количество" },
  // hAxis: { title: "Даты" },
  seriesType: "bars",
  series: { 2: { type: "line" } },
  backgroundColor: "#edeef0",
  bar: {
    groupWidth: "30%",
  },
  colors: ["#42bb54", "#57a8ea", "#e4a232"],
  fontSize: 14,
  fontName: "Roboto",
  legend: {
    position: "bottom",
  },
  curveType: "function",
  animation: {
    duration: 1000,
    easing: "out",
    startup: true,
  },
};

const columnNames = [["Дата", "Создано", "Закрыто", "Открыто"]];

const FORMAT = "DD-MM-YYYY";
const OUTPUT_FORMAT = "YYYY-MM-DD";

class ClaimsDynamics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      period: "week",
      startDate: moment(new Date()).subtract(8, "days").format(FORMAT),
      endDate: moment(new Date()).subtract(1, "days").format(FORMAT),
      detail: detailOptions[0],
      data: [],
      chartType: "CLAIMS",
      module: {
        value: 1,
        label: "Все",
      },
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

  loadData = async () => {
    this.setState({ loading: true });
    let response;

    try {
      response = await getClaimsDynamicsData(
        this.state.chartType,
        moment(this.state.startDate, FORMAT).format(OUTPUT_FORMAT),
        moment(this.state.endDate, FORMAT).format(OUTPUT_FORMAT),
        this.state.module.value,
        this.state.detail.value
      );

      if (this.state.detail.value === "day") {
        const formattedData = [...response.data];

        formattedData.forEach(
          (item) => (item[0] = moment(item[0]).format(FORMAT))
        );

        this.setState({
          loading: false,
          data: columnNames.concat(formattedData),
          error: false,
          errorMessage: "",
        });
      } else {
        const formattedData = [...response.data];

        formattedData.forEach((item) => {
          const date = item[0].split("-");
          const firstPart = moment(date[0]).format("D MMM");
          const secondPart = moment(date[1]).format("D MMM");
          console.log("First part", firstPart);
          console.log("Second part", secondPart);

          item[0] = [firstPart, secondPart].join("-");
        });

        this.setState({
          loading: false,
          data: columnNames.concat(formattedData),
          error: false,
          errorMessage: "",
        });
      }
    } catch (err) {
      this.setState({
        loading: false,
        error: true,
        errorMessage:
          "Не удается получить данные, обратитесь в службу техподдержки",
      });
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
        <h2 className="page-heading">Динамика обращений</h2>

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
            <div className="graph-filters-dates-select-label">Модуль</div>
            <div className="graph-filters-dates-select-wrapper">
              <Select
                value={this.state.module}
                onChange={this.handleModuleChange}
                options={modules}
              />
            </div>
          </div>
          <a href="#" download className="graph-filters-download">
            <Download className="graph-filters-download-icon" />
          </a>
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
              <>
                <Chart
                  width={"100%"}
                  height={"700px"}
                  chartType="ComboChart"
                  loader={<div className="loader">Загрузка графика...</div>}
                  data={this.state.data}
                  options={chartOptions}
                  legendToggle
                />
                <TableView data={this.state.data} />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ClaimsDynamics;
