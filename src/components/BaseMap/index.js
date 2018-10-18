import React from "react";
import { geoPath, geoEqualEarth, geoAlbersUsa, geoMercator } from "d3-geo";
import { feature } from "topojson-client";
import { zoom } from "d3-zoom";
import { select, event as currentEvent } from "d3-selection";

class BaseMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = { features: [], zoomTransform: null };
    this.svg = null;
    this.handleZoom = this.handleZoom.bind(this);
    this.zoom = zoom()
      .scaleExtent([1, 4])
      .translateExtent([[0, 0], [this.props.width, this.props.height]])
      .extent([[0, 0], [this.props.width, this.props.height]])
      .on("zoom", this.zoomed.bind(this));
  }

  componentDidMount() {
    this.loadGeometry();
    select(this.svg)
      .call(this.zoom)
      .on("wheel.zoom", null);
  }

  componentDidUpdate() {
    select(this.svg)
      .call(this.zoom)
      .on("wheel.zoom", null);
  }

  loadGeometry() {
    if (this.props.geometry === "world") {
      let features, path;
      fetch(
        "https://s3-us-west-2.amazonaws.com/na-data-projects/geography/world.json"
      )
        .then(response => response.json())
        .then(world => {
          const projection = geoMercator().fitSize(
            [this.props.width, this.props.height],
            feature(world, world.objects.countries)
          );
          this.props.projectionInit && this.props.projectionInit(projection);
          this.setState({
            feature: feature(world, world.objects.countries),
            features: feature(world, world.objects.countries).features,
            path: geoPath().projection(projection)
          });
        });
      return {
        features,
        path
      };
    } else if (this.props.geometry === "us") {
      fetch(
        "https://s3-us-west-2.amazonaws.com/na-data-projects/geography/us.json"
      )
        .then(response => response.json())
        .then(us => {
          const projection = geoAlbersUsa().fitSize(
            [this.props.width, this.props.height],
            feature(us, us.objects.states)
          );
          this.props.projectionInit && this.props.projectionInit(projection);
          this.setState({
            features: feature(us, us.objects.states).features,
            path: geoPath().projection(projection)
          });
        });
    }
  }

  handleZoom(e, direction) {
    e.preventDefault();
    if (direction === "in") {
      console.log(this.zoom.scaleBy);
      select(this.svg).call(this.zoom.scaleBy(select(this.svg), 1.5));
    }
    if (direction === "out") {
      select(this.svg).call(this.zoom.scaleBy(select(this.svg), 0.5));
    }
  }

  zoomed() {
    this.setState({
      zoomTransform: currentEvent.transform
    });
  }

  render() {
    const projection = geoMercator().fitSize(
      [this.props.width, this.props.height],
      this.state.feature
    );
    const { features } = this.state;
    const { fillFunc, mouseIn, mouseOut } = this.props;
    const path = geoPath().projection(projection);
    return (
      <React.Fragment>
        <svg
          width={this.props.width}
          height={this.props.height}
          ref={el => (this.svg = el)}
        >
          <g className="geometry" transform={this.state.zoomTransform}>
            {features.map((d, i) => {
              return (
                <path
                  key={`path-${i}`}
                  d={path(d)}
                  fill={fillFunc ? fillFunc(d.id) : "#CBCBCD"}
                  onMouseMove={e => mouseIn(e, d)}
                  onMouseOut={mouseOut}
                  stroke="#E5E5E5"
                />
              );
            })}
          </g>
        </svg>
        <div className="dv-map-controls">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <a
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2rem",
                  height: "2rem",
                  marginBottom: "0.25rem",
                  backgroundColor: "#fff",
                  border: "1px solid #ddd"
                }}
                href="#"
                onClick={e => this.handleZoom(e, "in")}
              >
                <svg
                  style={{ width: "0.5rem", height: "0.5rem" }}
                  viewBox="0 0 12 13"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g
                    fillRule="nonzero"
                    stroke="#979797"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="square"
                  >
                    <path d="M6 1v11M11 6.5H1" />
                  </g>
                </svg>
              </a>
              <a
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2rem",
                  height: "2rem",
                  backgroundColor: "#fff",
                  border: "1px solid #ddd"
                }}
                href="#"
                onClick={e => this.handleZoom(e, "out")}
              >
                <svg
                  style={{ width: "0.5rem", height: "0.5rem" }}
                  viewBox="0 0 14 2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 1H1"
                    fillRule="nonzero"
                    stroke="#979797"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="square"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default BaseMap;
