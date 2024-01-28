import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { EventType } from '@azure/msal-browser';

import { b2cPolicies } from './authConfig';
import { compareIssuingPolicy } from './utils/claimUtils';

// components
import { PageLayout } from './components/PageLayout';

// pages
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';
import StationsView from './pages/Stations';
import ReportSummary, { ReportFiles, UploadReportForm } from './pages/Reports';
import OptimizerView, { TrainingHistoryView, ModelTrainerView } from './pages/Optimizer';

const backend_url = process.env.REACT_APP_BACKEND_URL;
const sidebarOptions = [
  {
    "name": "Stations",
    "icon": "bi geo-alt-fill",
    "options": [
      {
        "name": "View",
        "link": "/stations/view",
      },
    ],
  },
  {
    "name": "Reports",
    "icon": "bi journal-text",
    "options": [
      {
        "name": "Summary",
        "link": "/reports/summary",
      },
      {
        "name": "File History",
        "link": "/reports/files",
      },
      {
        "name": "Upload",
        "link": "/reports/upload",
      },
    ],
  },
  {
    "name": "Optimizer",
    "icon": "bi calculator-fill",
    "options": [
      {
        "name": "History",
        "image": "assets/img/profile-img.jpg",
        "link": "/optimizer/history",
      },
      {
        "name": "Train",
        "image": "assets/img/profile-img.jpg",
        "link": "/optimizer/train",
      },
      {
        "name": "Predict",
        "image": "assets/img/profile-img.jpg",
        "link": "/optimizer/predict",
      },
    ],
  },
];

const Pages = () => {
  /**
   * useMsal is hook that returns the PublicClientApplication instance,
   * an array of all accounts currently signed in and an inProgress value
   * that tells you what msal is currently doing. For more, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
   */
  const { instance } = useMsal();
  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      console.log('event', event);
      if (
        (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
        event.payload.account
      ) {
        /**
         * For the purpose of setting an active account for UI update, we want to consider only the auth
         * response resulting from SUSI flow. "tfp" claim in the id token tells us the policy (NOTE: legacy
         * policies may use "acr" instead of "tfp"). To learn more about B2C tokens, visit:
         * https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
         */
        if (event.payload.idTokenClaims['tfp'] === b2cPolicies.names.editProfile) {
          // retrieve the account from initial sing-in to the app
          const originalSignInAccount = instance
            .getAllAccounts()
            .find(
              (account) =>
                account.idTokenClaims.oid === event.payload.idTokenClaims.oid &&
                account.idTokenClaims.sub === event.payload.idTokenClaims.sub &&
                account.idTokenClaims['tfp'] === b2cPolicies.names.signUpSignIn
            );

          let signUpSignInFlowRequest = {
            authority: b2cPolicies.authorities.signUpSignIn.authority,
            account: originalSignInAccount,
          };

          // silently login again with the signUpSignIn policy
          instance.ssoSilent(signUpSignInFlowRequest);
        }

        /**
         * Below we are checking if the user is returning from the reset password flow.
         * If so, we will ask the user to reauthenticate with their new password.
         * If you do not want this behavior and prefer your users to stay signed in instead,
         * you can replace the code below with the same pattern used for handling the return from
         * profile edit flow
         */
        if (compareIssuingPolicy(event.payload.idTokenClaims, b2cPolicies.names.forgotPassword)) {
          let signUpSignInFlowRequest = {
            authority: b2cPolicies.authorities.signUpSignIn.authority,
          };
          instance.loginRedirect(signUpSignInFlowRequest);
        }
      }

      if (event.eventType === EventType.LOGIN_FAILURE) {
        // Check for forgot password error
        // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
        if (event.error && event.error.errorMessage.includes('AADB2C90118')) {
          const resetPasswordRequest = {
            authority: b2cPolicies.authorities.forgotPassword.authority,
            scopes: [],
          };
          instance.loginRedirect(resetPasswordRequest);
        }
      }

      if (event.eventType === EventType.LOGOUT_START) {
        console.log('logout event', event);
        try {
          // instance.logoutRedirect();
          instance.logout();
        }
        catch (error) {
          console.log(error);
        }
      }
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
    // eslint-disable-next-line
  }, [instance]);

  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="index.html" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="stations">
        <Route path="view" element={<StationsView backend_url={backend_url} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="reports">
        <Route path="summary" element={<ReportSummary backend_url={backend_url} />} />
        <Route path="files" element={<ReportFiles backend_url={backend_url} />} />
        <Route path="upload" element={<UploadReportForm backend_url={backend_url} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="optimizer">
        <Route path="history" element={<TrainingHistoryView backend_url={backend_url} />} />
        <Route path="train" element={<ModelTrainerView backend_url={backend_url} />} />
        <Route path="predict" element={<OptimizerView backend_url={backend_url} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = ({ instance }) => {
  return (
    <MsalProvider instance={instance}>
      <PageLayout sidebarOptions={sidebarOptions}>
        <Pages />
      </PageLayout>
    </MsalProvider>
  );
};

export default App;