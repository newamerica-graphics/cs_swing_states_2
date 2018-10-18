import React from "react";
import "./Select.scss";

export default class Select extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { options, selected, onChange, className, style } = this.props;
    return (
      <select
        onChange={event => this.props.onChange(event.target.value)}
        className={`dv-select ${className || ""}`}
        style={style}
      >
        <option value="" className="dv-filter-by" disabled selected hidden>
          Filter by...
        </option>
        {options.map((option, i) => (
          <option selected={option === selected ? true : false} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }
}
