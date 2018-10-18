import "./index.scss";
import SwingStates from "./charts/SwingStates";
import Scatterplot from "./charts/Scatterplot";

let queue = [];
let data = null;

const settings = {
  viz__app: el => {
    ReactDOM.render(
      <SwingStates
        data={data.map}
        title={data.meta.filter(val => val.chart === "map")[0].title}
        description={
          data.meta.filter(val => val.chart === "map")[0].description
        }
      />,
      el
    );
  },
  viz__scatter: el => {
    ReactDOM.render(
      <Scatterplot
        data={data.scatter}
        x={d => d.character}
        y={d => d.content}
        title={data.meta.filter(val => val.chart === "scatter")[0].title}
      />,
      el
    );
  }
};

fetch("https://na-data-projects.s3.amazonaws.com/data/cs/swing_states_2.json")
  .then(response => response.json())
  .then(_data => {
    data = _data;
    for (let i = 0; i < queue.length; i++) queue[i]();
  });

window.renderDataViz = function(el) {
  let id = el.getAttribute("id");
  let chart = settings[id];
  if (!chart) return;

  if (data) {
    chart(el);
  } else {
    queue.push(() => chart(el));
  }
};
