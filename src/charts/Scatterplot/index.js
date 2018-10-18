import React from "react";
import ChartContainer from "../../components/ChartContainer";
import { Group } from "@vx/group";
import { Text } from "@vx/text";
import { GlyphDot, GlyphCircle } from "@vx/glyph";
import { scaleLinear, scaleOrdinal } from "@vx/scale";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { max, extent } from "d3-array";
import { format } from "d3-format";
import { withTooltip, TooltipWithBounds } from "@vx/tooltip";
import { ParentSize } from "@vx/responsive";
import { localPoint } from "@vx/event";
import { selectAll } from "d3-selection";

const Up = () => (
  <svg
    viewBox="0 0 19 46"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    style={{ height: "2rem", width: "2rem" }}
  >
    <g fill="#22C8A3" fill-rule="evenodd">
      <path d="M11 19.5v26.128H8V19.5H0L9.5.5l9.5 19h-8z" fill-rule="nonzero" />
      <path d="M7 19h5v27H7z" />
    </g>
  </svg>
);

const Down = () => (
  <svg
    viewBox="0 0 19 45"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    style={{ height: "2rem", width: "2rem" }}
  >
    <g fill="#FF2D44" fill-rule="evenodd">
      <path d="M11 26.5V.372H8V26.5H0l9.5 19 9.5-19h-8z" fill-rule="nonzero" />
      <path d="M7 27h5V0H7z" />
    </g>
  </svg>
);

class Scatterplot extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeYear: "" };
    this.handleLegendClick = this.handleLegendClick.bind(this);
    this.clickOut = this.clickOut.bind(this);
  }

  handleLegendClick(e, year) {
    this.setState({ activeYear: year });
    selectAll(`.dot`).attr("opacity", 0.2);
    selectAll(`.year-${year}`).attr("opacity", 1);
  }

  clickOut() {
    this.setState({ activeYear: "" });
    selectAll(`.dot`).attr("opacity", 1);
  }

  render() {
    const {
      data,
      title,
      subtitle,
      source,
      maxWidth,
      height,
      x,
      y,
      xFormat,
      yFormat,
      xAxisLabel,
      yAxisLabel,
      colors
    } = this.props;

    const margin = {
      top: 40,
      bottom: 50,
      left: 50,
      right: 25
    };
    return (
      <ChartContainer height={500} maxWidth={850} title={title} source={source}>
        <ParentSize>
          {({ width, height }) => {
            const xMax = width - margin.left - margin.right;
            const yMax = height - margin.top - margin.bottom;
            if (width < 10) return null;

            const xScale = scaleLinear({
              domain: [0, max(data, x)],
              range: [0, xMax],
              clamp: true
            });

            const yScale = scaleLinear({
              domain: [0, max(data, y)],
              range: [yMax, 0],
              clamp: true
            });
            return (
              <React.Fragment>
                <svg width={width} height={height}>
                  <g transform={`translate(${margin.left}, ${margin.top})`}>
                    <rect
                      onClick={this.clickOut}
                      width={xMax}
                      height={yMax}
                      style={{ pointerEvents: "bounding-box" }}
                      fill="transparent"
                    />
                    <Group top={30} left={50}>
                      <g
                        onClick={e => this.handleLegendClick(e, "2018")}
                        style={{ cursor: "pointer" }}
                      >
                        <GlyphCircle
                          fill="#22C8A3"
                          size={100}
                          stroke={"rgba(0,0,0,0.3)"}
                          top={0}
                          left={0}
                        />
                        <Text
                          verticalAnchor="middle"
                          x={10}
                          y={0}
                          style={{ fontSize: "14px" }}
                        >
                          2018
                        </Text>
                      </g>
                      <g
                        onClick={e => this.handleLegendClick(e, "2014")}
                        style={{ cursor: "pointer" }}
                      >
                        <GlyphCircle
                          fill="#4C81DB"
                          size={100}
                          stroke={"rgba(0,0,0,0.3)"}
                          top={25}
                          left={0}
                        />
                        <Text
                          verticalAnchor="middle"
                          x={10}
                          y={25}
                          style={{ fontSize: "14px" }}
                        >
                          2014
                        </Text>
                      </g>
                    </Group>
                    {data.map((point, i) => {
                      const key = point.country
                        .replace(/\s+/g, "-")
                        .toLowerCase();
                      return (
                        <GlyphCircle
                          className={`dot ${key} year-${point.year}`}
                          key={`point-${i}`}
                          stroke={"rgba(0,0,0,0.3)"}
                          fill={point.year === "2018" ? "#22C8A3" : "#4C81DB"}
                          left={xScale(x(point))}
                          top={yScale(y(point))}
                          style={{ cursor: "pointer" }}
                          size={100}
                          onMouseEnter={() => event => {
                            const coords = localPoint(
                              event.target.ownerSVGElement,
                              event
                            );
                            this.props.showTooltip({
                              tooltipLeft: coords.x,
                              tooltipTop: coords.y,
                              tooltipData: point
                            });
                            selectAll(".dot").attr("opacity", 0.25);
                            selectAll(`.${key}`)
                              .attr("opacity", 1)
                              .attr("stroke", "#333")
                              .attr("stroke-width", 2);
                          }}
                          onTouchStart={() => event => {
                            const coords = localPoint(
                              event.target.ownerSVGElement,
                              event
                            );
                            this.props.showTooltip({
                              tooltipLeft: coords.x,
                              tooltipTop: coords.y,
                              tooltipData: point
                            });
                          }}
                          onMouseLeave={() => event => {
                            this.props.hideTooltip();
                            selectAll(".dot")
                              .attr("opacity", 1)
                              .attr("stroke", "rgba(0,0,0,0.3)")
                              .attr("stroke-width", 1);
                          }}
                        />
                      );
                    })}
                    <AxisLeft
                      scale={yScale}
                      label="Character of Internet Governance"
                      stroke={"rgba(0,0,0,0.15)"}
                      hideTicks={true}
                      tickLabelProps={() => ({
                        fontFamily: "Circular",
                        fontSize: "12px",
                        textAnchor: "end",
                        fill: "#333"
                      })}
                      labelProps={{
                        x: -50,
                        y: -10,
                        transform: "none",
                        textAnchor: "start",
                        fill: "#333",
                        fontSize: "14px",
                        fontWeight: "bold"
                      }}
                    />
                    <AxisBottom
                      scale={xScale}
                      top={yMax}
                      label="Internet Content Openness"
                      stroke={"rgba(0,0,0,0.15)"}
                      hideTicks={true}
                      tickLabelProps={() => ({
                        fontFamily: "Circular",
                        fontSize: "12px",
                        dy: "1.5em",
                        fill: "#333",
                        textAnchor: "middle"
                      })}
                      labelProps={{
                        transform: `translate(${xMax / 2}, 35)`,
                        textAnchor: "end",
                        fill: "#333",
                        fontSize: "14px",
                        fontWeight: "bold"
                      }}
                    />
                  </g>
                </svg>
                {this.props.tooltipOpen && (
                  <TooltipWithBounds
                    left={width - 250}
                    top={250}
                    style={{
                      padding: "1rem",
                      borderRadius: 0,
                      boxShadow:
                        "0 2px 5px 0 rgba(0, 0, 0, 0.15), 0 2px 10px 0 rgba(0, 0, 0, 0.1)",
                      color: "#333333"
                    }}
                  >
                    <h4
                      style={{
                        marginTop: 0,
                        marginBottom: "0.5rem",
                        fontSize: "1rem"
                      }}
                    >
                      {this.props.tooltipData.country}
                    </h4>
                    <div
                      style={{
                        borderTop: "1px solid #ededed",
                        borderBottom: "1px solid #ededed",
                        paddingBottom: "0.5rem",
                        marginBottom: "0.5rem",
                        paddingTop: "0.5rem",
                        marginTop: "0.5rem",
                        fontSize: "14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <div style={{ paddingBottom: "0.5rem" }}>
                          Character (2018):{" "}
                          <strong>
                            {format(".2")(
                              data.filter(
                                country =>
                                  country.country ===
                                    this.props.tooltipData.country &&
                                  country.year === "2018"
                              )[0].character
                            )}
                          </strong>
                        </div>
                        <div>
                          Character (2014):{" "}
                          <strong>
                            {format(".2")(
                              data.filter(
                                country =>
                                  country.country ===
                                    this.props.tooltipData.country &&
                                  country.year === "2014"
                              )[0].character
                            )}
                          </strong>
                        </div>
                      </div>
                      <div
                        style={{
                          paddingLeft: "0.5rem",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        {format("0.2")(
                          data.filter(
                            country =>
                              country.country ===
                                this.props.tooltipData.country &&
                              country.year === "2018"
                          )[0].character
                        ) -
                          format("0.2")(
                            data.filter(
                              country =>
                                country.country ===
                                  this.props.tooltipData.country &&
                                country.year === "2014"
                            )[0].character
                          ) <
                        0 ? (
                          <Down />
                        ) : format("0.2")(
                          data.filter(
                            country =>
                              country.country ===
                                this.props.tooltipData.country &&
                              country.year === "2018"
                          )[0].character
                        ) -
                          format("0.2")(
                            data.filter(
                              country =>
                                country.country ===
                                  this.props.tooltipData.country &&
                                country.year === "2014"
                            )[0].character
                          ) >
                        0 ? (
                          <Up />
                        ) : null}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                        fontSize: "14px"
                      }}
                    >
                      <div>
                        <div style={{ paddingBottom: "0.5rem" }}>
                          Content (2018):{" "}
                          <strong>
                            {format(".2")(
                              data.filter(
                                country =>
                                  country.country ===
                                    this.props.tooltipData.country &&
                                  country.year === "2018"
                              )[0].content
                            )}
                          </strong>
                        </div>
                        <div>
                          Content (2014):{" "}
                          <strong>
                            {format(".2")(
                              data.filter(
                                country =>
                                  country.country ===
                                    this.props.tooltipData.country &&
                                  country.year === "2014"
                              )[0].content
                            )}
                          </strong>
                        </div>
                      </div>
                      <div
                        style={{
                          paddingLeft: "0.5rem",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        {format("0.2")(
                          data.filter(
                            country =>
                              country.country ===
                                this.props.tooltipData.country &&
                              country.year === "2018"
                          )[0].content
                        ) -
                          format("0.2")(
                            data.filter(
                              country =>
                                country.country ===
                                  this.props.tooltipData.country &&
                                country.year === "2014"
                            )[0].content
                          ) <
                        0 ? (
                          <Down />
                        ) : (
                          <Up />
                        )}
                      </div>
                    </div>
                  </TooltipWithBounds>
                )}
              </React.Fragment>
            );
          }}
        </ParentSize>
      </ChartContainer>
    );
  }
}

export default withTooltip(Scatterplot);
