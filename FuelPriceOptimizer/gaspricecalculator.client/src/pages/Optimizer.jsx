import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import * as Utils from "../components/Utils";

function PredictFuelPrice({ backend_url }) {
  const [volume, setVolume] = useState(50);
  const [profitMargin, setProfitMargin] = useState(80);
  const [marketShare, setMarketShare] = useState(50);
  const [prediction, setPrediction] = useState(0);

  const onRangeChange = (value, setterFunction) => {
    setterFunction(value);
  };

  const handleSubmit = async () => {
    try {
      const postData = {
        volume,
        profitMargin,
        marketShare,
      };
      const response = await axios.post(`${backend_url}/optimization/price`, postData);
      const data = response.data;
      if (data) {
        setPrediction(data.fuelPrice);

        const priceElement = document.getElementById('price');
        if (!!priceElement) {
          priceElement.innerHTML = data;
        }
      }
    } catch (error) {
      console.log('Could not get prediction:', error.message);
    }
  };

  const savePrice = async () => {
    alert("Optimization prediction has been saved successfully!");
  };

  return (
    <>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Fuel price optimizer</h5>
          This service estimates the optimal fuel price based on extensive training using historical data per zone.
          Use the sliders below to tune the values of the allowed parameters, and click <b>Submit</b> when you are ready.
          You can experiment with the sliders to observe how the optimal price changes based on the parameters.
          If you wish to record the optimal price, click <b>Save</b> to store it as this week's price.
          Saving the optimal price will override any previous values.
        </div>
      </div>
      <div class="row">
        <div class="col-lg-8">
          <div class="row">
            <div class="col-12">
              <div class="card h-100">
                <div class="card-body p-4">
                  <form>
                    <div class="row card-body">
                      <div class="col-xxl-4 col-md-5">
                        <label htmlFor="volume" class="form-label m-3">Volume</label>
                      </div>
                      <div class="col-xxl-4 col-md-7">
                        <input
                          type="range"
                          class="form-range"
                          id="volume"
                          min={0}
                          max={100}
                          onChange={(e) => onRangeChange(e.target.value, setVolume)}
                        />
                      </div>
                      <div className="col-xxl-4 col-md-6">
                        <span
                          id="volume-value"
                          className="border border-primary rounded p-1"
                        >
                          {volume}
                        </span>
                      </div>
                    </div>
                    <div class="row card-body">
                      <div class="col-xxl-4 col-md-5">
                        <label htmlFor="marketShare" class="form-label m-3">Market share</label>
                      </div>
                      <div class="col-xxl-4 col-md-7">
                        <input
                          type="range"
                          class="form-range"
                          id="marketShare"
                          min={0}
                          max={100}
                          onChange={(e) => onRangeChange(e.target.value, setMarketShare)}
                        />
                      </div>
                      <div className="col-xxl-4 col-md-6">
                        <span
                          id="marketShare-value"
                          className="border border-primary rounded p-1"
                        >
                          {marketShare}
                        </span>
                      </div>
                    </div>
                    <div class="row card-body">
                      <div class="col-xxl-4 col-md-5">
                        <label htmlFor="profitMargin" class="form-label m-3">Profit margin</label>
                      </div>
                      <div class="col-xxl-4 col-md-7">
                        <input
                          type="range"
                          class="form-range"
                          id="profitMargin"
                          min={0}
                          max={100}
                          onChange={(e) => onRangeChange(e.target.value, setProfitMargin)}
                        />
                      </div>
                      <div className="col-xxl-4 col-md-6">
                        <span
                          id="profitMargin-value"
                          className="border border-primary rounded p-1"
                        >
                          {profitMargin}
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card h-100">
            <div class="card-body align-items-center justify-content-center d-flex">
              <div class="activity">
                <div class="activity-item">
                  <div class="activity-content d-flex flex-column align-items-center text-center">
                    {prediction > 0 && (
                      <div>
                        <div>
                          <h1>
                            <span class="text-success">Optimal Price: $</span><span id="price" class="text-success">{prediction}</span>
                          </h1>
                        </div>
                        <div>
                          <button
                            type="submit"
                            class="btn btn-primary"
                            onClick={() => savePrice()}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                    {prediction === 0 && (
                      <h1>
                        <span class="text-warning">Optimal Price: $0.0</span>
                      </h1>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-12">
          <div class="col-12">
            <div class="p-3">
              <button
                type="primary"
                class="btn btn-primary"
                onClick={() => handleSubmit()}
              >
                Calculate
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const TrainingHistoryGrid = ({ trainingHistory }) => {
  const [loading, setLoading] = useState(true);
  const gridRef = useRef();
  const rowHeight = 40;
  const gridHeight = Math.min(200 + trainingHistory.length * rowHeight, 500);
  const gridStyle = useMemo(() => ({ height: gridHeight, width: '100%' }), [gridHeight]);
  const paginationPageSizeSelectors = useMemo(() => ([10, 30, 50, 100]), []);
  const paginationPageSize = useMemo(() => (10), []);
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    filterParams: {
      buttons: ['reset']
    },
    floatingFilter: false,
  }), []);
  const columnDefs = useMemo(() => ([
    {
      field: 'date',
      filter: 'agDateColumnFilter',
      cellRenderer: Utils.DateCellRenderer("MM/dd/yy hh:mm a"),
    },
    {
      field: 'user',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'durationInMinutes',
      filter: 'agNumberColumnFilter',
    },
  ]), []);

  const frameworkComponents = {
    UrlCellRenderer: Utils.UrlCellRenderer,
  };

  useEffect(() => {
    if (trainingHistory.length > 0) {
      setLoading(false);
    }
  }, [trainingHistory]);

  if (loading) {
    return Utils.LoadingSpinnerCard(gridStyle, { width: "50px", height: "50px" });
  }

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body d-flex align-items-center">
            <h5 className="card-title mb-0">Training History</h5>
          </div>
          <div className="ag-theme-alpine" style={gridStyle}>
            <AgGridReact
              ref={gridRef}
              rowData={trainingHistory}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSizeSelector={paginationPageSizeSelectors}
              paginationPageSize={paginationPageSize}
              frameworkComponents={frameworkComponents}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const TrainingHistoryView = ({ backend_url }) => {
  const [trainingHistory, setTrainingHistory] = useState([]);

  useEffect(() => {
    const getTrainingHistory = async () => {
      try {
        const response = await axios.get(`${backend_url}/optimization/training/history`);
        const data = response.data;
        if (Array.isArray(data)) {
          setTrainingHistory(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getTrainingHistory();
  }, [backend_url]);

  return (
    <>
      <TrainingHistoryGrid trainingHistory={trainingHistory} />
    </>
  );
}

const ModelTrainerView = ({ backend_url }) => {
  return (
    <>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Model optimization (Coming soon...)</h5>
          Train your forecasting models to provide the most accurate fuel prices based on the latest report data.
        </div>
      </div>
    </>
  )
}

function OptimizerView({ backend_url }) {
  return (
    <div>
      <PredictFuelPrice backend_url={backend_url} />
    </div>
  );
}

export default OptimizerView;
export { TrainingHistoryView, ModelTrainerView };