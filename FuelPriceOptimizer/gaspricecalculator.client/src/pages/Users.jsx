import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import * as Utils from "../components/Utils";

const UsersGrid = ({ backend_url }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  // const [gridApi, setGridApi] = useState(null);
  const gridRef = useRef();
  const gridStyle = useMemo(() => ({ height: 400, width: "100%" }), []);
  const paginationPageSizeSelectors = useMemo(() => ([10, 30, 50, 100]), []);
  const paginationPageSize = useMemo(() => (50), []);
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

  const userActions = (props) => {
    return (
      <div>
        <a href="#" onClick={() => handleEditUser(props.data.id)}>
          <i title="Edit user" class="bi bi-pencil-fill" style={{ marginRight: "10px" }}></i>
        </a>
        <a href="#" onClick={() => handleResetPassword(props.data.id)}>
          <i title="Reset password" class="bi bi-key-fill" style={{ marginRight: "10px" }}></i>
        </a>
        <a href="#" onClick={handleDeleteUser(props.data.id)}>
          <i title="Delete user" class="bi bi-trash-fill" style={{ marginRight: "10px" }}></i>
        </a>
      </div>
    )
  };

  const columnDefs = useMemo(() => ([
    {
      headerName: 'Name',
      field: 'displayName'
    },
    {
      headerName: 'Email',
      field: 'identities',
      valueGetter: (params) => {
        console.log(params.data.identities);
        const emailIdentity = params.data.identities.find((identity) => identity.signInType === 'emailAddress' || identity.signInType === 'userName');
        return emailIdentity ? emailIdentity.issuerAssignedId : 'Not found';
      },
    },
    {
      headerName: 'Account Enabled',
      field: 'accountEnabled',
      floatingFilter: false,
    },
    { 
      headerName: 'Is Admin',
      field: 'isAdmin', 
      floatingFilter: false,
    },
    {
      headerName: 'Actions',
      cellRenderer: userActions,
      sortable: false,
      filter: false,
      resizable: false,
      floatingFilter: false,
    },
  ]), []);

  useEffect(() => {
    // Fetch users on component mount
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backend_url}/graph/users`);
      let data = response.data;
      data = data.filter(user => !user.identities.some(identity => identity.signInType === 'federated')
      );
  
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEditUser = (user) => {
    // Implement edit logic
    console.log('Edit user:', user);
  };

  const handleResetPassword = (user) => {
    // Implement reset password logic
    console.log('Reset password for user:', user);
  };

  const handleDeleteUser = (user) => {
    // Implement delete logic
    console.log('Delete user:', user);
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch(`${backend_url}/graph/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(/* new user data */),
      });

      if (response.ok) {
        const newUser = await response.json();
        setUsers([...users, newUser]);
      } else {
        console.error('Failed to add user:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      setLoading(false);
    }
  }, [users]);

  if (loading) {
    return Utils.LoadingSpinnerCard(gridStyle, { width: "50px", height: "50px" });
  };

  return (
    <div>
      <div className="ag-theme-alpine" style={gridStyle}>
        <AgGridReact
        ref={gridRef}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSizeSelector={paginationPageSizeSelectors}
          paginationPageSize={paginationPageSize}
          rowData={users}
          // onGridReady={(params) => setGridApi(params.api)}
        />
      </div>
      <button onClick={handleAddUser}>Add New User</button>
    </div>
  );
};

export default UsersGrid;
