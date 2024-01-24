// https://cloud.google.com/blog/products/maps-platform/introducing-react-components-for-the-maps-javascript-api

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import Chart from "react-google-charts";
import * as Utils from "./Utils";

function StationsGrid({ stations, onRowSelectionChanged }) {
  const [loading, setLoading] = useState(true);
  const gridRef = useRef();
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
  ]), []);

  useEffect(() => {
    if (stations.length > 0) {
      setLoading(false);
    }
  }, [stations]);

  if (loading) {
    return Utils.LoadingSpinnerCard(gridStyle, { width: "50px", height: "50px" });
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body d-flex align-items-center">
            <h5 className="card-title mb-0">Stations</h5>
            {/* <button type="reset" className="btn btn-secondary ml-auto">
              Reset
            </button> */}
          </div>
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
  );
}

function StationsMap(props) {
  const [loading, setLoading] = useState(true);
  const [useBounds, setUseBounds] = useState(false);
  const [mapBounds, setMapBounds] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 0.0,
    lng: 0.0,
  });
  const [mapZoom, setMapZoom] = useState(15);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const mapContainerStyle = {
    minHeight: "200px",
    height: "400px",
    width: "100%",
  };
  const calculateMapBounds = () => {
    if (props.stations.length > 0) {
      console.log('station count:', props.stations.length);
      let west = props.stations[0].longitude;
      let east = props.stations[0].longitude;
      let north = props.stations[0].latitude;
      let south = props.stations[0].latitude;

      for (let i = 1; i < props.stations.length; i++) {
        const station = props.stations[i];
        west = Math.min(west, station.longitude);
        east = Math.max(east, station.longitude);
        north = Math.max(north, station.latitude);
        south = Math.min(south, station.latitude);
      }

      setMapBounds({ west, east, north, south });
    }
  };

  useEffect(() => {
    if (props.stations.length > 0) {
      calculateMapBounds();
      setLoading(false);
    }
  }, [props.stations]);

  useEffect(() => {
    if (!!mapBounds) {
      console.log('bounds:', mapBounds);
      if (props.stations.length === 1) {
        setUseBounds(false);
        setMapCenter({
          lat: mapBounds.north,
          lng: mapBounds.west,
        });
        setMapZoom(15);
      }
      else {
        setUseBounds(true);
        setMapCenter({
          lat: mapBounds.north - ((mapBounds.north - mapBounds.south) / 2) + 0.0001,
          lng: mapBounds.east - ((mapBounds.east - mapBounds.west) / 2) + 0.0001,
        });
        setMapZoom(10);
      }
    }
  }, [mapBounds]);

  useEffect(() => {
    console.log('use bounds:', useBounds);
    console.log('map center:', mapCenter);
    console.log('map zoom:', mapZoom);
  }, [mapCenter, mapZoom]);

  if (loading) {
    return Utils.LoadingSpinnerCard(mapContainerStyle, { width: "50px", height: "50px" });
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
                // center={useBounds ? undefined : mapCenter}
                zoom={useBounds ? undefined : mapZoom}
                initialBounds={useBounds ? mapBounds : undefined}
                center={mapCenter}
                // zoom={mapZoom}
                // initialBounds={mapBounds}
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

function StationsPieChart(props) {
  const [loading, setLoading] = useState(true);
  const chartContainerStyle = {
    height: "400px",
    width: "100%",
  };

  const options = {
    title: 'Stations per Zone',
    pieHole: 0.4,
    is3D: false,
  };

  useEffect(() => {
    if (props.data.length > 1) {
      setLoading(false);
    }
  }, [props.data]);

  if (loading) {
    return Utils.LoadingSpinnerCard(chartContainerStyle, { width: "50px", height: "50px" });
  }

  return (
    <Chart
      chartType="PieChart"
      data={props.data}
      options={options}
      height={chartContainerStyle.height}
      width={chartContainerStyle.width}
    />
  );
}

const StationsView = ({ backend_url }) => {
  const [stations, setStations] = useState([]);
  const [selectedStations, setSelectedStations] = useState([]);
  const [mapId, setMapId] = useState(1);
  const [chartData, setChartData] = useState([]);

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
    let stationCountArray = [['Task', 'Stations per Zone'], ...Utils.GroupDataByProperty(stations, 'zoneId')];
    setChartData(stationCountArray);
  }, [stations]);

  return (
    <section className="section">
      <StationsGrid stations={stations} onRowSelectionChanged={onStationSelectionChanged} />
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body container-fluid">
                <div className="row">
                  <div className="col">
                    <StationsMap stations={selectedStations} mapId={mapId} />
                  </div>
                  <div className="col">
                    <StationsPieChart data={chartData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StationsView;
