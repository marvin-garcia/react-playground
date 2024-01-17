import React, { useState, Component } from 'react';
import axios from 'axios';

const backend_url = 'http://localhost:5299/files';

class ReportFileGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      loading: true,
      error: null,
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(`${backend_url}`);
      this.setState({
        loading: false,
        files: response.data,
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
    const { files, loading, error } = this.state;

    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    return (
      <div>
        <h2>Reports</h2>
        <div className="grid-container">
          <table class="table text-center">
            <thread>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Url</th>
                {/* Add more properties as needed */}
              </tr>
                <tbody>
                {files.map(file => (
                  <tr>
                    <td>Id: {file.id}</td>
                    <td>Name: {file.name}</td>
                    <td>Url: {file.url}</td>
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

export default ReportFileGrid;