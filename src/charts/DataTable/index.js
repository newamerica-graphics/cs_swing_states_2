import React from "react";
import ChartContainer from "../../components/ChartContainer";
import ReactTable from "react-table";
import Pagination from "./Pagination";
import withSearch from "./WithSearch";
import Select from "../../components/Select";
import "react-table/react-table.css";
import "./DataTable.scss";

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filter: "All" };
    this.updateFilter = this.updateFilter.bind(this);
  }

  updateFilter(val) {
    this.setState({ filter: val });
  }

  render() {
    const { data, filter, columns, showPagination } = this.props;

    let _data = data.filter(val => filter[val.country_type]);

    return (
      <React.Fragment>
        <div className="dv-data-table__filter">{this.props.children}</div>
        <ReactTable
          data={_data}
          columns={columns}
          className="-striped"
          showPagination={showPagination ? showPagination : false}
          showPageSizeOptions={false}
          PaginationComponent={Pagination}
        />
      </React.Fragment>
    );
  }
}
const DataTableWithSearch = withSearch(DataTable);
export { DataTable, DataTableWithSearch };
