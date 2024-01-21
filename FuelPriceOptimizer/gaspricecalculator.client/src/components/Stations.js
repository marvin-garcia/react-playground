import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function StationsTable({ backend_url }) {
  const cont4ainerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: 800, width: '100%' }), []);
  const paginationPageSizeSelectors = useMemo(() => ([30, 50, 100]), []);
  const paginationPageSize = useMemo(() => (50), []);
  const [rowData, setRowData] = useState([]);

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
      field: 'zoneId',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'stationNumber',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'stationName',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'streetAddress',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'city',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'state',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'zipCode',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'cot',
      filter: 'agTextColumnFilter',
    }
  ]), []);

  const tableRef = useRef();

  useEffect(() => {
    const getStationsData = async () => {
      try {
        console.log('getting stations data');
        // let response = await axios.get(`${backend_url}/stations/summary`);
        // let data = response.data;
        // setStationsSummary(data);

        const response = await axios.get(`${backend_url}/stations`);
        const  data = response.data;
        if (Array.isArray(data)) {
          console.log('data rows:', data.length);
          console.log('data sample:', data[0]);
          setRowData(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getStationsData();

  }, []);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Stations</h5>
            <div className="ag-theme-alpine" style={gridStyle}>
              <AgGridReact
                ref={tableRef}
                rowData={rowData}
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
  );
}

const StationsView = ({ backend_url }) => {
  return (
    <section className="section">
      <StationsTable backend_url={backend_url} />
    </section>
  );
};

export default StationsView;
