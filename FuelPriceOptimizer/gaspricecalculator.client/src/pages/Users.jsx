import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import * as Utils from "../components/Utils";

const UsersGrid = ({ backend_url }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const gridRef = useRef();
  const [gridStyle, setGridStyle] = useState({ height: "500px", width: "100%" });
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
        <a href="#" onClick={() => handleDeleteUser(props.data.id)}>
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

  useEffect(() => {
    const resizeGrid = () => {
      const rowHeight = 40;
      const gridHeight = Math.min(200 + users.length * rowHeight, 800);
      setGridStyle({ height: gridHeight, width: '100%' });
    };

    resizeGrid();
  }, [users]);

  const handleEditUser = (user) => {
    // Implement edit logic
    console.log('Edit user:', user);
  };

  const handleResetPassword = (user) => {
    // Implement reset password logic
    console.log('Reset password for user:', user);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${backend_url}/graph/users/${userId}`);
      if (response.status === 200) {
        await fetchUsers();
      }
      else {
        console.error(`Failed to delete user: Status: ${response.status}. Reason: ${response.statusText}`);
      }
    }
    catch (error) {
      console.error('Error deleting user:', error);
    }

    setLoading(false);
    alert("User deleted successfully!");
  };

  const handleAddUser = async (event) => {
    const elements = event.target.elements;

    const displayName = elements[0].value;
    const email = elements[1].value;
    const isAdmin = elements[2].checked;
    const accountEnabled = elements[3].checked;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert(`${email} is not a valid email address.`);
      return;
    }

    setLoading(true);
    try {
      const postData = {
        displayName: displayName,
        identities: [
          {
            signInType: "emailAddress",
            issuerAssignedId: email,
          },
        ],
        accountEnabled: accountEnabled,
        isAdmin: isAdmin,
      };

      const response = await axios.post(`${backend_url}/graph/users`, postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const newUser = response.data;
        setUsers([...users, newUser]);
      } else {
        console.error(`Failed to add user: Status: ${response.status}. Reason: ${response.statusText}`);
      }
    }
    catch (error) {
      console.error('Error adding user:', error);
    }

    setLoading(false);
    alert("User created successfully!");
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
    <>
      <div>
        <div className="ag-theme-alpine" style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            key={users.length}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSizeSelector={paginationPageSizeSelectors}
            paginationPageSize={paginationPageSize}
            rowData={users}
          // domLayout="autoHeight"
          />
        </div>
      </div>
      <div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#disablebackdrop" style={{ marginTop: "30px" }}>
          Add user
        </button>
      </div>
      <NewUserModal onSubmit={handleAddUser} />
    </>
  );
};

const NewUserModal = (props) => {

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    props.onSubmit(event);
  };

  return (
    <div class="modal fade" id="disablebackdrop" tabIndex="-1" data-bs-backdrop="false">
      <div class="modal-dialog modal-md modal-dialog-centered">
        <div class="modal-content">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Add user</h5>
              <form class="row g-4" onSubmit={handleSubmit}>
                <div class="col-md-10">
                  <input type="text" class="form-control" placeholder="Full Name" required />
                </div>
                <div class="col-md-10">
                  <input type="email" class="form-control" placeholder="Email" required />
                </div>
                <div class="col-md-10">
                  <input type="checkbox" class="form-check-input" placeholder="isAdmin" />
                  <label class="form-check-label" for="isAdmin" style={{ marginLeft: "10px" }}>
                    Administrator
                  </label>
                </div>
                <div class="col-md-10">
                  <input type="checkbox" class="form-check-input" placeholder="accountEnabled" defaultChecked />
                  <label class="form-check-label" for="accountEnabled" style={{ marginLeft: "10px" }}>
                    Enabled
                  </label>
                </div>
                <div class="text-center">
                  <button type="submit" class="btn btn-primary" style={{ marginRight: "10px" }}>Submit</button>
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersGrid;
