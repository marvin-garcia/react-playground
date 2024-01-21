import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { APIProvider, Map, Marker, useMapsLibrary } from "@vis.gl/react-google-maps";

function StationsGrid({ stations }) {
  const gridRef = useRef();
  const cont4ainerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: 800, width: '100%' }), []);
  const paginationPageSizeSelectors = useMemo(() => ([20, 30, 50, 100]), []);
  const paginationPageSize = useMemo(() => (20), []);
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

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Stations</h5>
            <div className="ag-theme-alpine" style={gridStyle}>
              <AgGridReact
                ref={gridRef}
                rowData={stations}
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

function StationsMap({ stations }) {
  const apiKey = "AIzaSyCDuR1hB3peUxx8gbWRRL7YyPTsH8lWwCU";
  const mapContainerStyle = {
    height: "400px",
    width: "100%",
  };
  const center = {
    lat: 21,
    lng: -157,
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <APIProvider apiKey={apiKey} libraries={['marker']}>
              <Map
                style={mapContainerStyle}
                center={center}
                zoom={9}
              >
                {stations.map((station) => (
                  <Marker
                    key={stations.indexOf(station)}
                    position={{ lat: station.latitude, lng: station.longitude }}
                  />
                ))}
              </Map>
            </APIProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

const StationsView = ({ backend_url }) => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const getStationsData = async () => {
      try {
        const response = await axios.get(`${backend_url}/stations`);
        const data = response.data;
        if (Array.isArray(data)) {
          setStations(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getStationsData();
  }, [backend_url]);

  return (
    <section className="section">
      <StationsGrid stations={stations} />
      <StationsMap stations={stations} />
    </section>
  );
};

export default StationsView;
