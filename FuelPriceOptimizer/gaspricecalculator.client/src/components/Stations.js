import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function StationsTable({ backend_url }) {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
  }), []);

  const tableRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backend_url}/stations`);
        const data = response.data;
        if (Array.isArray(data)) {
          let _columnDefs = [];
          for (const key in data[0]) {
            _columnDefs.push({
              field: key,
              sortable: true,
              filter: true,
            });
          }

          setRowData(data);
          setColumnDefs(_columnDefs);
          console.log('rows', rowData);
          console.log('cols:', columnDefs);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Stations</h5>
            <div className="ag-theme-alpine" style={{ height: 800 }}>
              <AgGridReact
                ref={tableRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
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
