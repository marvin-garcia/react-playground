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
      buttons: ['reset']
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
  const title = 'Zones Summary';
  const zones = [...new Set(props.data.map(item => item.zoneId))];
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
        {
          field: 'avgTransferPrice',
          headerName: 'Avg Transfer Price',
          filter: 'agNumberColumnFilter',
          sortable: false,
        },
        {
          field: 'avgDtwPrice',
          headerName: 'Avg Dtw Price',
          filter: 'agNumberColumnFilter',
          sortable: false,
        },
      ],
    })),
  ];
  const zoneId = '10A';
  const zoneData = props.data.filter(item => item.zoneId === zoneId);
  const chartOptions = {
    title: {
      text: title,
    },
    // autoSize: true,
    data: zoneData,
    series: [
      {
        xKey: 'date',
        yKey: 'avgTransferPrice',
        yName: 'Avg. transfer price',
      },
      {
        xKey: 'date',
        yKey: 'avgDtwPrice',
        yName: 'Avg. DTW price',
      }
    ],
    legend: {
      enabled: true,
    },
  };

  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <h5 className="card-title mb-0">{title}</h5>
            <div className="card-body container-fluid d-flex align-items-center">
              <Grid columnDefs={columnDefs} data={props.data} />
            </div>
          </div>
        </div>
      </div><div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body container-fluid d-flex align-items-center">
              <Chart chartOptions={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StationsSummary(props) {

}

const SummaryView = ({ backend_url }) => {
  const [type, setType] = useState('zones');
  const [stationsSummary, setStationsSummary] = useState([]);
  const [zonesSummary, setZonesSummary] = useState([]);

  useEffect(() => {
    const getZonesData = async () => {
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

    // const getStationsData = async () => {
    //   try {
    //     const response = await axios.get(`${backend_url}/stations/summary`);
    //     const data = response.data;
    //     if (Array.isArray(data)) {
    //       setStationsSummary(data);
    //     }
    //   } catch (error) {
    //     console.log('Could not get stations summary data:', error.message);
    //   }
    // };

    getZonesData();
    // getStationsData();
  }, [backend_url]);

  return (
    <section className="section">
      <ZonesSummary data={zonesSummary} />
    </section>
  );
};

export default SummaryView;