import { AuthenticatedTemplate } from '@azure/msal-react';

/***
 * Component to detail ID token claims with a description for each claim. For more details on ID token claims, please check the following links:
 * ID token Claims: https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token
 * Optional Claims:  https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-optional-claims#v10-and-v20-optional-claims-set
 */
export const Dashboard = () => {
  return (
    <>
      <AuthenticatedTemplate>
        <div class="card">
        <div class="card-body">
          <h5 class="card-title">Coming soon...</h5>
          Snapshot about stations, reports and optimizer will be displayed here.
        </div>
      </div>
      </AuthenticatedTemplate>
    </>
  );
};