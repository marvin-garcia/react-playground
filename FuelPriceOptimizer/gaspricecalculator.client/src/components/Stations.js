// https://cloud.google.com/blog/products/maps-platform/introducing-react-components-for-the-maps-javascript-api

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { APIProvider, Map, Marker, useMapsLibrary } from "@vis.gl/react-google-maps";

function StationsGrid({ stations, onRowSelectionChanged }) {
  const gridRef = useRef();
  const cont4ainerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: 600, width: '100%' }), []);
  const paginationPageSizeSelectors = useMemo(() => ([10, 20, 30, 50, 100]), []);
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
    },
    {
      field: 'latitude',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'longitude',
      filter: 'agNumberColumnFilter',
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
                rowSelection={'multiple'}
                onSelectionChanged={() => onRowSelectionChanged(gridRef.current)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StationsMap(props) {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const mapContainerStyle = {
    height: 400,
    width: "100%",
  };
  const center = {
    lat: 0.0,
    lng: 0.0,
  };
  const defaultZoom = 15;

  let useBounds = false;
  if (props.mapBounds) {
    if (
      props.mapBounds.north === props.mapBounds.south &&
      props.mapBounds.east === props.mapBounds.west
    ) {
      center['lat'] = props.mapBounds.north;
      center['lng'] = props.mapBounds.west;
    }
    else {
      useBounds = true;
      center['lat'] = props.mapBounds.north - ((props.mapBounds.north - props.mapBounds.south) / 2);
      center['lng'] = props.mapBounds.east - ((props.mapBounds.east - props.mapBounds.west) / 2);
    }

    console.log(props.mapBounds);
    console.log(useBounds);
  }

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <APIProvider apiKey={apiKey} libraries={['marker']}>
              <Map
                key={props.mapId}
                style={mapContainerStyle}
                center={useBounds ? undefined : center}
                zoom={useBounds ? undefined : defaultZoom}
                initialBounds={useBounds ? props.mapBounds : undefined}
              >
                {props.stations.map((station) => (
                  <Marker
                    key={`${props.mapId}-${props.stations.indexOf(station)}`}
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
  const [selectedStations, setSelectedStations] = useState([]);
  const [mapId, setMapId] = useState(1);
  const [mapBounds, setMapBounds] = useState(null);

  const onStationSelectionChanged = (grid) => {
    // create new map ID to be used as a key
    setMapId(mapId + 1);

    const selectedRows = grid.api.getSelectedRows();
    if (selectedRows.length === 0) {
      setSelectedStations(stations);
    }
    else {
      setSelectedStations(selectedRows);
    }
  };

  useEffect(() => {
    const getStationsData = async () => {
      try {
        const response = await axios.get(`${backend_url}/stations`);
        const data = response.data;
        if (Array.isArray(data)) {
          setStations(data);
          setSelectedStations(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getStationsData();
  }, [backend_url]);

  useEffect(() => {
    const calculateMapBounds = () => {

      if (selectedStations.length > 0) {
        let west = selectedStations[0].longitude;
        let east = selectedStations[0].longitude;
        let north = selectedStations[0].latitude;
        let south = selectedStations[0].latitude;

        for (let i = 1; i < selectedStations.length; i++) {
          const station = selectedStations[i];

          west = Math.min(west, station.longitude);
          east = Math.max(east, station.longitude);
          north = Math.max(north, station.latitude);
          south = Math.min(south, station.latitude);
        }

        setMapBounds({ west, east, north, south });
      }
    };

    calculateMapBounds();
  }, [selectedStations]);

  return (
    <section className="section">
      <StationsGrid stations={stations} onRowSelectionChanged={onStationSelectionChanged} />
      <StationsMap stations={selectedStations} mapId={mapId} mapBounds={mapBounds} />
    </section>
  );
};

export default StationsView;
