import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import * as Utils from "./Utils";

function ReportsGrid({ reports }) {
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

function ReportForm({ backend_url }) {
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

const ReportsGridView = ({ backend_url }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const getReportsData = async () => {
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

    getReportsData();
  }, [backend_url]);

  return (
    <section className="section">
      <ReportsGrid reports={reports} />
    </section>
  );
};

export default ReportsGridView;
export { ReportForm };