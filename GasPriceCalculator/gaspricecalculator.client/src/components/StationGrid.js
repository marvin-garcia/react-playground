import React, { useState, Component } from 'react';
import axios from 'axios';

const backend_url = 'http://localhost:5299/stations';

class StationGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: [],
      loading: true,
      error: null,
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(`${backend_url}`);
      this.setState({
        loading: false,
        stations: response.data,
      });
    }
    catch (error) {
      this.setState({
        loading: false,
        error: error.message,
      });
    }
  }

  render() {
    const { stations, loading, error } = this.state;

    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    return (
      <div>
        <h2>Stations</h2>
        <div className="grid-container">
          <table class="table text-center">
            <thread>
              <tr>
                <th>Station Number</th>
                <th>OPIS Number</th>
                <th>Station Name</th>
                {/* Add more properties as needed */}
              </tr>
                <tbody>
                {stations.map(station => (
                  <tr>
                    <td>Station Number: {station.stationNumber}</td>
                    <td>OPIS Number: {station.opisNumber}</td>
                    <td>Station Name: {station.stationName}</td>
                    {/* Add more properties as needed */}
                  </tr>
                ))}
              </tbody>
            </thread>
          </table>
        </div>
      </div>
    );
  }
}

export default StationGrid;