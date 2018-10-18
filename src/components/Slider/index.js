import React from "react";
import "./Slider.scss";

class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
    this.props.onChange(e.target);
  }

  render() {
    const { label, min, max, step, id, secondary } = this.props;
    const { value } = this.state;
    const gradValue = Math.round((+value / +max) * 1 * 100);
    return (
      <div className="dv-range-slider">
        <div className="dv-range-slider__label-container">
          <span className="dv-range-slider__label">{label}</span>
          <span className="dv-range-slider__value">
            {value} out of {max}
          </span>
        </div>
        <input
          id={id}
          className={`dv-range-slider__range ${
            secondary ? "dv-range-slider__range-secondary" : ""
          }`}
          type="range"
          value={value}
          min={min}
          max={max}
          step={step || 1}
          onChange={e => this.handleChange(e)}
          style={{
            background: `linear-gradient(90deg,${
              secondary ? "#333" : "#2dd1ac"
            } ${gradValue}%,#e3e3e3 ${gradValue}%)`
          }}
        />
      </div>
    );
  }
}

export default Slider;
