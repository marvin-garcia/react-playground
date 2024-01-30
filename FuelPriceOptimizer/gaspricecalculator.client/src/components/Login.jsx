import React from "react";
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

const Login = () => {
  const { instance, inProgress } = useMsal();
  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  };

  return (
    <div style={{width: "100%", boxSizing: "border-box"}}>
      <section className="section register d-flex align-items-center justify-content-center py-4" style={{width: "100%"}}>
        <div className="container" style={{width: "100%"}}>
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="d-flex justify-content-center py-4">
                <a href="index.html" className="logo d-flex align-items-center w-auto">
                  <img src="assets/img/logo.png" alt="" />
                  <span className="d-none d-lg-block">FuelPriceOptimizer</span>
                </a>
              </div>
              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                  </div>
                  <div className="container">
                    <button
                      className="btn btn-primary w-100"
                      type="button"
                      style={{ marginTop: "40px" }}
                      onClick={handleLoginRedirect}
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;