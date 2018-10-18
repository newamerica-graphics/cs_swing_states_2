import React from "react";
import BaseMap from "../../components/BaseMap";
import ChartContainer from "../../components/ChartContainer";
import { withTooltip, TooltipWithBounds } from "@vx/tooltip";
import { localPoint } from "@vx/event";
import { LegendLinear } from "@vx/legend";
import { scale } from "chroma-js";
import { scaleSequential } from "d3-scale";
import { interpolateViridis } from "d3-scale-chromatic";
import { min, max } from "d3-array";
import { format } from "d3-format";
import { withParentSize } from "@vx/responsive";
import CheckboxGroup from "../../components/CheckboxGroup";

class Choropleth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        "Global & Open": true,
        "Sovereign & Closed": true,
        "Digital Deciders": true,
        "LDC or Small Country": false
      }
    };
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.mouseIn = this.mouseIn.bind(this);
  }

  handleCheckboxChange(e) {
    this.setState({
      filter: { ...this.state.filter, [e.target.id]: e.target.checked }
    });
  }

  mouseIn = (e, d) => {
    const coords = localPoint(e.target.ownerSVGElement, e);
    const countryData = this.props.data.filter(
      country => country.id == d.id
    )[0];
    if (countryData) {
      this.props.showTooltip({
        tooltipLeft: coords.x,
        tooltipTop: coords.y,
        tooltipData: countryData
      });
    }
  };

  render() {
    const {
      geometry,
      width,
      height,
      tooltipOpen,
      tooltipData,
      tooltipLeft,
      tooltipTop,
      showTooltip,
      hideTooltip,
      parentWidth,
      parentHeight
    } = this.props;

    const { data, filter } = this.props;

    let _data = data.filter(val => filter[val.country_type]);

    const chromaScale = scale(["#FF2D44", "#4C81DB"])
      .domain([0, 1])
      .mode("rgb");

    const fillFunc = id => {
      // const scale = scaleSequential(interpolateViridis).domain([0, 1]);
      let score;
      _data.forEach(d => {
        if (+d.id === id) {
          score = parseFloat(d.weightedScore);
        }
      });
      return chromaScale(score);
    };

    return (
      <div style={{ width: "100%", height: "100%" }}>
        <BaseMap
          geometry={geometry}
          width={parentWidth}
          height={parentHeight}
          fillFunc={fillFunc}
          selectFunc={this.selectFunc}
          mouseIn={this.mouseIn}
          mouseOut={hideTooltip}
        />
        <LegendLinear
          shape="circle"
          scale={chromaScale}
          labelFormat={d => format(".3")(d)}
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            padding: "0.5rem",
            fontSize: "14px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            maxWidth: "100px",
            display: "flex",
            flexDirection: "column"
          }}
          className="dv-choro-legend"
          domain={[1, 0.75, 0.5, 0.25, 0]}
        />
        {tooltipOpen && (
          <TooltipWithBounds
            key={
              Math.random() // set this to random so it correctly updates with parent bounds
            }
            top={tooltipTop}
            left={tooltipLeft}
            style={{
              padding: "1rem",
              borderRadius: 0,
              boxShadow:
                "0 2px 5px 0 rgba(0, 0, 0, 0.15), 0 2px 10px 0 rgba(0, 0, 0, 0.1)"
            }}
          >
            <h4
              style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1rem" }}
            >
              <strong>{tooltipData.country}</strong>
            </h4>
            <div style={{ color: "#2c2f35", marginBottom: "0.5rem" }}>
              Overall Rank: <strong>{tooltipData.rank}</strong>
            </div>
            <div style={{ color: "#2c2f35" }}>
              Weighted Score:{" "}
              <strong>{format(".3")(tooltipData.weightedScore)}</strong>
            </div>
          </TooltipWithBounds>
        )}
      </div>
    );
  }
}

export default withParentSize(withTooltip(Choropleth));
