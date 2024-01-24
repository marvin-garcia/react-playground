import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { AgChartsReact } from "ag-charts-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import * as Utils from "./Utils";

const ReportsGrid = ({ reports }) => {
  const [loading, setLoading] = useState(true);
  const gridRef = useRef();
  const rowHeight = 40;
  const gridHeight = Math.min(200 + reports.length * rowHeight, 500);
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
    floatingFilter: true,
  }), []);
  const columnDefs = useMemo(() => ([
    {
      field: 'name',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'uploadDate',
      filter: 'agDateColumnFilter',
      cellRenderer: Utils.DateCellRenderer("MM/dd/yy hh:mm a"),
    },
    {
      field: 'url',
      cellRenderer: Utils.UrlCellRenderer,
    },
  ]), []);

  const frameworkComponents = {
    UrlCellRenderer: Utils.UrlCellRenderer,
  };

  useEffect(() => {
    if (reports.length > 0) {
      setLoading(false);
    }
  }, [reports]);

  if (loading) {
    return Utils.LoadingSpinnerCard(gridStyle, { width: "50px", height: "50px" });
  }

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body d-flex align-items-center">
            <h5 className="card-title mb-0">Reports</h5>
          </div>
          <div className="ag-theme-alpine" style={gridStyle}>
            <AgGridReact
              ref={gridRef}
              rowData={reports}
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

const UploadReportForm = ({ backend_url }) => {
  const inputRef = useRef();

  const handleSubmit = async () => {
    const fileInput = document.getElementById("formFile");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(`${backend_url}/files/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // cleanup form input
      alert("File uploaded successfully!");
      inputRef.current.value = "";
    }
    catch (error) {
      console.error("Error uploading file:", error.message);
      // Handle error or perform any other actions
      alert("Error uploading file. Please try again.");
    }
  };

  return (
    <section class="section">
      <div class="row">
        <div class="col-lg-5">
          <div class="card">
            <div class="card-body container-fluid">
              <div class="row mb-5 mt-5">
                <form>
                  <h4>Upload report</h4>
                  <div class="col-sm-10">
                    <input
                      ref={inputRef}
                      class="form-control"
                      type="file"
                      id="formFile"
                    />
                  </div>
                </form>
              </div>
              <div class="row mb-3 mt-3">
                <div class="col">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    onClick={() => handleSubmit(backend_url)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}

const ReportFiles = ({ backend_url }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const getReportFiles = async () => {
      try {
        const response = await axios.get(`${backend_url}/files`);
        const data = response.data;
        if (Array.isArray(data)) {
          setReports(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getReportFiles();
  }, [backend_url]);

  return (
    <section className="section">
      <ReportsGrid reports={reports} />
    </section>
  );
};

const ZonesGrid = (props) => {
  const [loading, setLoading] = useState(true);
  const zones = [...new Set(props.data.map(item => item.zoneId))];

  // grid options
  const childrenFields = ['avgTransferPrice', 'avgDtwPrice'];
  const columnDefs = [
    {
      field: 'date',
      filter: 'agDateColumnFilter',
      cellRenderer: Utils.DateCellRenderer("MM/dd/yy"),
      pinned: true,
    },
    ...zones.map(zoneId => ({
      field: zoneId,
      headerName: `Zone ${zoneId}`,
      children: [
        ...childrenFields.map(field => ({
          field: `${zoneId}_${field}`,
          headerName: field,
          filter: 'agNumberColumnFilter',
          sortable: false,
        })),
      ],
    })),
  ];
  const rowHeight = 40;
  const gridHeight = Math.min(200 + props.timeseries.length * rowHeight, 500);
  const gridStyle = useMemo(() => ({ height: gridHeight, width: '100%' }), [gridHeight]);
  const paginationPageSizeSelectors = useMemo(() => ([10, 20, 30, 50, 100]), []);
  const paginationPageSize = useMemo(() => (20), []);
  const defaultColDef = {
    resizable: true,
    filterParams: {
      buttons: ['apply', 'reset']
    }
  };

  useEffect(() => {
    if (props.data.length > 0 && props.timeseries.length > 0) {
      setLoading(false);
    }
  }, [props.data, props.timeseries]);

  if (loading) {
    return Utils.LoadingSpinnerCard(gridStyle, { width: "50px", height: "50px" });
  }
  return (
    <div className="card">
      <div className="card-body container-fluid d-flex align-items-center mt-3 ml-3 mr-3 mb-3">
        <div className="ag-theme-alpine" style={gridStyle}>
          <AgGridReact
            rowData={props.timeseries}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSizeSelector={paginationPageSizeSelectors}
            paginationPageSize={paginationPageSize}
          />
        </div>
      </div>
    </div>
  );
}

const ZonesChart = (props) => {
  const [loading, setLoading] = useState(true);
  const zones = [...new Set(props.data.map(item => item.zoneId))];

  // charts options
  const chartStyle = useMemo(() => ({ height: 500, width: '100%' }), []);
  const seriesYkeys = ['avgTransferPrice', 'avgDtwPrice'];
  const seriesLabels = ['Avg Transfer Price', 'Avg Dtw Price'];
  const data = Utils.FormatDatesInArray(props.data, "MM/dd/yy");

  const chartOptions = [];
  for (let s = 0; s < seriesYkeys.length; s++) {
    const seriesChartOptions = {
      title: {
        text: seriesLabels[s],
      },
      autoSize: true,
      series: [],
      legend: {
        enabled: true,
      },
    };
    for (let z = 0; z < zones.length; z++) {
      seriesChartOptions.series.push({
        data: data.filter(item => item.zoneId === zones[z]),
        xKey: 'date',
        yKey: seriesYkeys[s],
        yName: `Zone ${zones[z]}`,
      });
    }
    chartOptions.push(seriesChartOptions);
  }

  useEffect(() => {
    if (props.data.length > 0) {
      setLoading(false);
    }
  }, [props.data]);

  if (loading) {
    return Utils.LoadingSpinnerCard(chartStyle, { width: "50px", height: "50px" });
  }

  return (
    <div>
      {seriesYkeys.map((item) => (
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body container-fluid d-flex align-items-center">
                <div style={chartStyle}>
                  <AgChartsReact options={chartOptions[seriesYkeys.indexOf(item)]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const ZonesSummary = (props) => {
  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <ZonesGrid data={props.data} timeseries={props.timeseries} />
        </div>
      </div>
      <ZonesChart data={props.data} />
    </div>
  );
}

const StationsSummary = (props) => {
  const stations = [...new Set(props.data.map(item => item.stationNumber))];

  // grid options
  const childrenFields = ['volume', 'rolling7DayVolume', 'weekToWeekChangeVolume', 'changePercentage', 'margin', 'rum'];
  const columnDefs = [
    {
      field: 'date',
      filter: 'agDateColumnFilter',
      cellRenderer: Utils.DateCellRenderer("MM/dd/yy"),
      pinned: true,
    },
    ...stations.map(stationNumber => ({
      field: stationNumber,
      headerName: `Station Number ${stationNumber}`,
      children: [
        ...childrenFields.map(field => ({
          field: `${stationNumber}_${field}`,
          headerName: field,
          filter: 'agNumberColumnFilter',
          sortable: false,
        })),
      ],
    })),
  ];
  const rowHeight = 40;
  const gridHeight = Math.min(200 + props.timeseries.length * rowHeight, 500);
  const gridStyle = useMemo(() => ({ height: gridHeight, width: '100%' }), [gridHeight]);
  const paginationPageSizeSelectors = useMemo(() => ([10, 20, 30, 50, 100]), []);
  const paginationPageSize = useMemo(() => (20), []);
  const defaultColDef = {
    resizable: true,
    filterParams: {
      buttons: ['apply', 'reset']
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body container-fluid d-flex align-items-center mt-3 ml-3 mr-3 mb-3">
              {/* <Grid columnDefs={columnDefs} data={props.timeseries} /> */}
              <div className="ag-theme-alpine" style={gridStyle}>
                <AgGridReact
                  rowData={props.timeseries}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  pagination={true}
                  paginationPageSizeSelector={paginationPageSizeSelectors}
                  paginationPageSize={paginationPageSize}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ReportSummary = ({ backend_url }) => {
  const [type, setType] = useState('zones');
  const [zonesSummary, setZonesSummary] = useState([]);
  const [zonesTimeSeries, setZonesTimeSeries] = useState([]);
  const [stationsSummary, setStationsSummary] = useState([]);
  const [stationsTimeSeries, setStationsTimeSeries] = useState([]);
  const zonesTabRef = useRef();
  const stationsTabRef = useRef();

  useEffect(() => {
    const getZonesChartData = async () => {
      try {
        const response = await axios.get(`${backend_url}/zones/summary`);
        const data = response.data;
        if (Array.isArray(data)) {
          setZonesSummary(data);
        }
      } catch (error) {
        console.log('Could not get zones summary data:', error.message);
      }
    };
    const getZonesGridData = async () => {
      try {
        const response = await axios.get(`${backend_url}/Zones/summary/timeseries`);
        const data = response.data;
        if (Array.isArray(data)) {
          setZonesTimeSeries(data);
        }
      } catch (error) {
        console.log('Could not get zones time series data:', error.message);
      }
    };
    const getStationsChartData = async () => {
      try {
        const response = await axios.get(`${backend_url}/stations/summary`);
        const data = response.data;
        if (Array.isArray(data)) {
          setStationsSummary(data);
        }
      } catch (error) {
        console.log('Could not get stations summary data:', error.message);
      }
    };
    const getStationsGridData = async () => {
      try {
        const response = await axios.get(`${backend_url}/stations/summary/timeseries`);
        const data = response.data;
        if (Array.isArray(data)) {
          setStationsTimeSeries(data);
        }
      } catch (error) {
        console.log('Could not get stations time series data:', error.message);
      }
    };
    getZonesChartData();
    getZonesGridData();
    getStationsChartData();
    getStationsGridData();
  }, [backend_url]);

  const handleTabClick = (tab) => {
    if (tab === zonesTabRef.current) {
      setType('zones');
      tab.classList.add('active');
      stationsTabRef.current.classList.remove('active');
    }
    else if (tab === stationsTabRef.current) {
      setType('stations');
      tab.classList.add('active');
      zonesTabRef.current.classList.remove('active');
    }
  };

  return (
    <section className="section">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a
            ref={zonesTabRef}
            class="nav-link active"
            aria-current="page"
            href="#"
            onClick={() => handleTabClick(zonesTabRef.current)}
          >Zones
          </a>
        </li>
        <li class="nav-item">
          <a
            ref={stationsTabRef}
            class="nav-link"
            aria-current="page"
            href="#"
            onClick={() => handleTabClick(stationsTabRef.current)}
          >Stations
          </a>
        </li>
      </ul>
      {type === 'zones' && <ZonesSummary data={zonesSummary} timeseries={zonesTimeSeries} />}
      {type === 'stations' && <StationsSummary data={stationsSummary} timeseries={stationsTimeSeries} />}
    </section>
  );
};

export default ReportFiles;
export { UploadReportForm };
export { ReportSummary };