import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { AgChartsReact } from "ag-charts-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import * as Utils from "./Utils";

function Grid({ columnDefs, data }) {
  const gridRef = useRef();
  const rowHeight = 40;
  const gridHeight = Math.min(200 + data.length * rowHeight, 500);
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
    <div className="ag-theme-alpine" style={gridStyle}>
      <AgGridReact
        ref={gridRef}
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSizeSelector={paginationPageSizeSelectors}
        paginationPageSize={paginationPageSize}
      />
    </div>
  );
}

function Chart({ chartOptions }) {
  const chartRef = useRef();
  const gridStyle = useMemo(() => ({ height: 500, width: '100%' }), []);

  return (
    <div style={gridStyle}>
      <AgChartsReact ref={chartRef} options={chartOptions} />
    </div>
  );
}

function ZonesSummary(props) {
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

  // charts options
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

  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body container-fluid d-flex align-items-center mt-3 ml-3 mr-3 mb-3">
              <Grid columnDefs={columnDefs} data={props.timeseries} />
            </div>
          </div>
        </div>
      </div>
      {seriesYkeys.map((item) => (
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body container-fluid d-flex align-items-center">
                <Chart chartOptions={chartOptions[seriesYkeys.indexOf(item)]} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StationsSummary(props) {
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

  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body container-fluid d-flex align-items-center mt-3 ml-3 mr-3 mb-3">
              <Grid columnDefs={columnDefs} data={props.timeseries} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SummaryView = ({ backend_url }) => {
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

export default SummaryView;