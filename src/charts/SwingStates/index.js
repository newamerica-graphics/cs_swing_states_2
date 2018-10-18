import React from "react";
import { DataTableWithSearch } from "../DataTable";
import Slider from "../../components/Slider";
import Choropleth from "../../components/Choropleth";
import ButtonGroup from "../../components/ButtonGroup";
import CheckboxGroup from "../../components/CheckboxGroup";
import { format } from "d3-format";

export default class SwingStates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      filter: {
        "Global & Open": true,
        "Sovereign & Closed": true,
        "Digital Deciders": true,
        "LDC or Small Country": false
      },
      view: "map",
      s1: 5,
      s2: 5,
      s3: 5,
      s4: 5,
      s5: 5
    };
    this.handleToggleChange = this.handleToggleChange.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  componentDidMount() {
    this.updateData();
  }

  handleCheckboxChange(e) {
    this.setState({
      filter: { ...this.state.filter, [e.target.id]: e.target.checked }
    });
  }

  updateData() {
    let { s1, s2, s3, s4, s5 } = this.state;
    if (s1 === 0 && s2 === 0 && s3 === 0 && s4 === 0 && s5 === 0) {
      s1 = 1;
      s2 = 1;
      s3 = 1;
      s4 = 1;
      s5 = 1;
    }
    const formula = (r1, r2, r3, r4, r5) =>
      (s1 * r1 + s2 * r2 + s3 * r3 + s4 * r4 + s5 * r5) /
      (s1 + s2 + s3 + s4 + s5);
    const _data = this.state.data
      .map(country => {
        let { weightedScore, ...keys } = country;
        weightedScore = formula(
          parseFloat(country.internet_values_score),
          parseFloat(country.political_environment_score),
          parseFloat(country.international_internet_participation_score),
          parseFloat(country.international_political_influence_score),
          parseFloat(country.domestic_internet_score)
        );
        return {
          ...keys,
          weightedScore
        };
      })
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .map((val, i) => {
        let { rank, ...other } = val;
        return {
          rank: i + 1,
          ...other
        };
      });
    this.setState({ data: _data });
  }

  handleToggleChange(view) {
    this.setState({ view: view });
  }

  handleSliderChange(el) {
    this.setState({ [el.id]: +el.value }, this.updateData);
  }

  render() {
    const { title, description } = this.props;
    const { s1, s2, s3, s4, s5, data, filter, view } = this.state;
    const columns = [
      {
        Header: "Overall Rank",
        accessor: "rank"
      },
      {
        Header: "Country",
        accessor: "country",
        minWidth: 200
      },
      {
        Header: "Weighted Score",
        accessor: "weightedScore",
        Cell: row => format(".2")(row.value),
        minWidth: 150
      },
      {
        Header: "Internet Values Score",
        accessor: "internet_values_score",
        Cell: row => format(".2")(row.value),
        minWidth: 150
      },
      {
        Header: "Political Values Score",
        accessor: "political_environment_score",
        Cell: row => format(".2")(row.value),
        minWidth: 150
      },
      {
        Header: "International Internet Policy Participation Score",
        accessor: "international_internet_participation_score",
        Cell: row => format(".2")(row.value),
        minWidth: 150
      },
      {
        Header: "International Influence Score",
        accessor: "international_political_influence_score",
        Cell: row => format(".2")(row.value),
        minWidth: 150
      },
      {
        Header: "Internet Reliance Score",
        accessor: "domestic_internet_score",
        Cell: row => format(".2")(row.value),
        minWidth: 150
      }
    ];
    return (
      <div className="dv-app">
        <div className="dv-controls">
          <div>
            <div className="dv-title-container">
              <h1 className="dv-title">{title}</h1>
              <p className="dv-description">{description}</p>
            </div>
            <div className="switch-view">
              <ButtonGroup
                options={[
                  { text: "Map View", id: "map" },
                  { text: "Table View", id: "table" }
                ]}
                active="map"
                onChange={view => this.handleToggleChange(view)}
              />
            </div>
            <div
              style={{
                padding: "2rem 0",
                borderBottom: "1px solid #ddd"
              }}
            >
              <CheckboxGroup
                options={[
                  {
                    id: "Global & Open",
                    label: "Global & Open",
                    checked: true
                  },
                  {
                    id: "Sovereign & Closed",
                    label: "Sovereign & Closed",
                    checked: true
                  },
                  {
                    id: "Digital Deciders",
                    label: "Digital Deciders",
                    checked: true
                  },
                  {
                    id: "LDC or Small Country",
                    label: "LDC or Small Country",
                    checked: false
                  }
                ]}
                onChange={this.handleCheckboxChange}
                orientation="horizontal"
                style={{
                  backgroundColor: "#fff",
                  padding: "0",
                  margin: "0"
                }}
                title="Filter By"
              />
            </div>
            <div className="sliders">
              <Slider
                min="0"
                max="10"
                step="1"
                value={s1}
                onChange={e => this.handleSliderChange(e)}
                label="Internet Values Score"
                id="s1"
                secondary
              />
              <Slider
                min="0"
                max="10"
                step="1"
                value={s2}
                onChange={e => this.handleSliderChange(e)}
                label="Political Values Score"
                id="s2"
                secondary
              />
              <Slider
                min="0"
                max="10"
                step="1"
                value={s3}
                onChange={e => this.handleSliderChange(e)}
                label="International Internet Policy Participation Score"
                id="s3"
                secondary
              />
              <Slider
                min="0"
                max="10"
                step="1"
                value={s4}
                onChange={e => this.handleSliderChange(e)}
                label="International Influence Score"
                id="s4"
                secondary
              />
              <Slider
                min="0"
                max="10"
                step="1"
                value={s5}
                onChange={e => this.handleSliderChange(e)}
                label="Internet Reliance Score"
                id="s5"
                secondary
              />
            </div>
          </div>
        </div>
        <div className={view === "map" ? "dv-map" : "dv-table"}>
          <div
            style={{
              width: "100%",
              height: "100%"
            }}
          >
            {view === "map" && (
              <Choropleth geometry="world" data={data} filter={filter} />
            )}
            {view === "table" && (
              <DataTableWithSearch
                data={data}
                columns={columns}
                showPagination={true}
                filter={filter}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
