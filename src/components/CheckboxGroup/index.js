import React from "react";
import "./CheckboxGroup.scss";

export default class CheckboxGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.props.options.forEach(val => {
      this.state[val.id] = val.checked ? true : false;
    });
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.checked
    });
    this.props.onChange(e);
  }

  render() {
    const { orientation, options, style, title } = this.props;
    return (
      <div
        className={`dv-checkbox-container ${
          orientation === "vertical"
            ? "dv-checkbox-container-vertical"
            : orientation === "horizontal"
              ? "dv-checkbox-container-horizontal"
              : ""
        }`}
        style={{ ...style }}
      >
        {title ? (
          <span
            style={{
              margin: "0",
              paddingBottom: "0.5rem",
              fontSize: "14px",
              fontWeight: "bold",
              flexBasis: "100%"
            }}
          >
            {title}
          </span>
        ) : null}
        {options.map((option, i) => (
          <div className="dv-checkbox" key={i}>
            <input
              id={option.id}
              type="checkbox"
              checked={this.state[option.id]}
              onChange={this.handleChange}
            />
            <label htmlFor={option.id} className="dv-checkbox-label">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    );
  }
}
