import React, { useCallback, useState } from "react";
import { ReactComponent as Checkmark } from "../icons/checkmark.svg";
import "./CreateMetric.scss";
import { useHistory } from "react-router-dom";
import Select from "react-select";

const typeOptions = [
  { value: "Количественный", label: "Количественный" },
  { value: "Временной", label: "Временной" },
  { value: "Показатель", label: "Показатель" },
];

const CreateMetric = () => {
  const history = useHistory();

  const goBack = useCallback(() => {
    history.push('/metrics-handbook')
  }, [history]);


  const [type, setType] = useState(typeOptions[0]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleTypeChange = (selectedOption) => {
      setType(selectedOption)
  }


  const handleSubmit = () => {

  }

  return (
    <div className="create-metric">
      <form className="create-metric-form" onSubmit={handleSubmit}>
        <div className="create-metric-form-row">
          <label htmlFor="name" className="create-metric-form-label">
            Наименование
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="create-metric-form-input"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </div>
        <div className="create-metric-form-row">
          <label htmlFor="description" className="create-metric-form-label">
            Обозначение
          </label>
          <input
            type="text"
            name="description"
            className="create-metric-form-input"
            onChange={(event) => setDescription(event.target.value)}
            value={description}
          />
        </div>
        <div className="create-metric-form-row">
          <label htmlFor="description" className="create-metric-form-label">
            Тип
          </label>
          <Select
                value={type}
                onChange={handleTypeChange}
                options={typeOptions}
              />
        </div>
        <div className="create-metric-form-row">
          <label className="create-metric-form-checkbox">
              <input type="checkbox" name="detalization-1" className="create-metric-form-checkbox-input"/>
              <span className="create-metric-form-checkbox-mark">
                  <Checkmark/>
              </span>
              <span className="create-metric-form-checkbox-text">
                Детализация на подсистемы / модули / компоненты
              </span>
          </label>
         
        </div>
        <div className="create-metric-form-row">
          <label className="create-metric-form-checkbox">
              <input type="checkbox" name="detalization-2" className="create-metric-form-checkbox-input"/>
              <span className="create-metric-form-checkbox-mark">
                  <Checkmark/>
              </span>
              <span className="create-metric-form-checkbox-text">
                Детализация на группы операторов
              </span>
          </label>
         
        </div>
        <div className="create-metric-form-row">
          <label className="create-metric-form-checkbox">
              <input type="checkbox" name="detalization-3" className="create-metric-form-checkbox-input"/>
              <span className="create-metric-form-checkbox-mark">
                  <Checkmark/>
              </span>
              <span className="create-metric-form-checkbox-text">
                Детализация по операторам
              </span>
          </label>
         
        </div>
        <div className="create-metric-form-row">
          <label className="create-metric-form-checkbox">
              <input type="checkbox" name="detalization-4" className="create-metric-form-checkbox-input"/>
              <span className="create-metric-form-checkbox-mark">
                  <Checkmark/>
              </span>
              <span className="create-metric-form-checkbox-text">
                Детализация по типам заявок
              </span>
          </label>
         
        </div>
        <div className="create-metric-form-row">
          <label className="create-metric-form-checkbox">
              <input type="checkbox" name="detalization-5" className="create-metric-form-checkbox-input"/>
              <span className="create-metric-form-checkbox-mark">
                  <Checkmark/>
              </span>
              <span className="create-metric-form-checkbox-text">
              Детализация на подсистемы / модули / компоненты (в рамках типа)
              </span>
          </label>
         
        </div>
        <div className="create-metric-form-row">
          <label className="create-metric-form-checkbox">
              <input type="checkbox" name="detalization-6" className="create-metric-form-checkbox-input"/>
              <span className="create-metric-form-checkbox-mark">
                  <Checkmark/>
              </span>
              <span className="create-metric-form-checkbox-text">
                Детализация на группы операторов (в рамках типа)
              </span>
          </label>
         
        </div>
        <div className="create-metric-form-row">
          <label className="create-metric-form-checkbox">
              <input type="checkbox" name="detalization-7" className="create-metric-form-checkbox-input"/>
              <span className="create-metric-form-checkbox-mark">
                  <Checkmark/>
              </span>
              <span className="create-metric-form-checkbox-text">
                Детализация по операторам (в рамках типа)
              </span>
          </label>
         
        </div>
        <div className="create-metric-form-buttons">
          <button draggable="false" type="submit" className="create-metric-form-btn">
            Сохранить
          </button>
          <button draggable="false"
            type="button"
            className="create-metric-form-btn"
            onClick={goBack}
          >
            Назад
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMetric;
