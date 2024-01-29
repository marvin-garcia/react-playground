// https://cloud.google.com/blog/products/maps-platform/introducing-react-components-for-the-maps-javascript-api

import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { APIProvider, InfoWindow, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import Chart from "react-google-charts";
import * as Utils from "../components/Utils";

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

const MapUpdateComponent = (props) => {
  const mapId = props.mapId;
  const mapBounds = props.mapBounds;
  const map = useMap(mapId);

  useEffect(() => {
    if (!map) return;

    map.fitBounds({ north: mapBounds.north, south: mapBounds.south, east: mapBounds.east, west: mapBounds.west });
  }, [map, mapBounds, mapId]);

  return (<></>);
}

function StationsMap(props) {
  const stations = props.stations;
  const [loading, setLoading] = useState(true);
  const [mapBounds, setMapBounds] = useState(null);
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const mapContainerStyle = {
    minHeight: "200px",
    height: "400px",
    width: "100%",
  };

  useEffect(() => {
    if (stations.length > 0) {
      setLoading(false);

      const { north, south, east, west } = Utils.CalculateMapBounds(stations);
      setMapBounds({ north, south, east, west });
    }
  }, [stations]);

  if (loading) {
    return Utils.LoadingSpinnerCard(mapContainerStyle, { width: "50px", height: "50px" });
  }

  const toggleInfoWindow = (stationNumber) => {
    setInfoWindowShown(!infoWindowShown);
    setSelectedStation(stations.find(station => station.stationNumber === stationNumber));
  };

  const closeInfoWindow = () => {
    setInfoWindowShown(false);
    setSelectedStation(null);
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div id="map-div" className="card-body">
            <APIProvider apiKey={apiKey} libraries={['marker']}>
              <Map
                id={props.mapId}
                key={props.mapId}
                style={mapContainerStyle}
                gestureHandling={'greedy'}
              >
                {stations.map((station) => (
                  <Marker
                    key={`${props.mapId}-${stations.indexOf(station)}`}
                    position={{ lat: station.latitude, lng: station.longitude }}
                    onClick={() => toggleInfoWindow(station.stationNumber)}
                  // onMouseOver={() => toggleInfoWindow(station.stationNumber)}
                  />
                ))}
                {infoWindowShown && selectedStation && (
                  <InfoWindow
                    position={{ lat: selectedStation.latitude, lng: selectedStation.longitude }}
                    onCloseClick={closeInfoWindow}
                  >
                    <p>Zone: {selectedStation.zoneId}</p>
                    <p>Station: {selectedStation.stationNumber}</p>
                </InfoWindow>
                )}
              </Map>
              <MapUpdateComponent mapBounds={mapBounds} mapId={props.mapId} />
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
    <>
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
    </>
  );
};

export default StationsView;
