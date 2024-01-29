using Azure.Identity;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Newtonsoft.Json;

namespace FuelPriceOptimizer.Server.Models
{
    public class AADB2C
    {
        public class User
        {
            public class Identity
            {
                [JsonProperty("issuerAssignedId")]
                public string IssuerAssignedId { get; set; }
                [JsonProperty("signInType")]
                public string SingInType { get; set; }

                public Identity() { }

                public Identity(Microsoft.Graph.Models.ObjectIdentity identity)
                {
                    this.IssuerAssignedId = identity.IssuerAssignedId;
                    this.SingInType = identity.SignInType;
                }
            }

            [JsonProperty("id")]
            public string? Id { get; set; }
            [JsonProperty("createdDateTime")]
            public DateTimeOffset? CreatedDateTime { get; set; }
            [JsonProperty("givenName")]
            public string? GivenName { get; set; }
            [JsonProperty("displayName")]
            public string DisplayName { get; set; }
            [JsonProperty("identities")]
            public List<Identity>? Identities { get; set; }
            [JsonProperty("userPrincipalName")]
            public string? UserPrincipalName { get; set; }
            [JsonProperty("isAdmin")]
            public bool IsAdmin { get; set; }
            [JsonProperty("accountEnabled")]
            public bool AccountEnabled { get; set; }
            [JsonProperty("password")]
            public string? Password { get; set; }

            public User() { }

            public User(Microsoft.Graph.Models.User user, List<string> adminGroupMembers = null)
            {
                this.Id = user.Id;
                this.CreatedDateTime = user.CreatedDateTime.HasValue ? user.CreatedDateTime : null;
                this.DisplayName = user.DisplayName;
                this.GivenName = user.GivenName;
                this.Identities = user.Identities.Select(x => { return new Identity(x); }).ToList();
                this.AccountEnabled = user.AccountEnabled.HasValue ? user.AccountEnabled.Value : false;
                this.IsAdmin = adminGroupMembers != null ?
                    adminGroupMembers.Where(x => x == user.Id).Any()
                    : false;
            }
        }

        public class Group
        {
            [JsonProperty("id")]
            public string Id { get; set; }
            [JsonProperty("displayName")]
            public string DisplayName { get; set; }
            [JsonProperty("createdDateTime")]
            public DateTimeOffset? CreatedDateTime { get; set; }
            
            public Group() { }

            public Group(Microsoft.Graph.Models.Group group)
            {
                this.Id = group.Id;
                this.DisplayName = group.DisplayName;
                this.CreatedDateTime = group.CreatedDateTime;
            }
        }
    }

    public interface IGraphService
    {
        public Task<AADB2C.User> GetUser(string userId);
        public Task<List<AADB2C.User>> GetUsers();
        public Task<List<AADB2C.Group>> GetGroups();
        public Task<AADB2C.Group> GetGroup(string gorupId);
        public Task<AADB2C.User> CreateUser(AADB2C.User user);
    }

    public class GraphService : IGraphService
    {
        private readonly IConfiguration _configuration;
        private readonly GraphServiceClient _graphClient;
        private readonly string[] _userQueryProperties;
        private readonly string _adminGroupDisplayName = "admin";

        public GraphService(IConfiguration configuration)
        {
            _configuration = configuration;

            var tenantId = _configuration["AzureAdB2C:TenantId"];
            var clientId = _configuration["AzureAdB2C:ClientId"];
            var clientSecret = _configuration["AzureAdB2C:ClientSecret"];
            var clientSecretCredential = new ClientSecretCredential(tenantId, clientId, clientSecret);

            string[] scopes = { $"https://graph.microsoft.com/.default" };
            _graphClient = new GraphServiceClient(clientSecretCredential, scopes);

            _userQueryProperties = ["id", "givenName", "displayName", "accountEnabled", "identities", "createdDateTime", "memberOf"];
        }

        public async Task<List<AADB2C.Group>> GetGroups()
        {
            var groups = await _graphClient.Groups.GetAsync();
            var b2cGroups = new List<AADB2C.Group>();

            if (groups != null && groups.Value != null)
                b2cGroups = groups.Value.Select(x => { return new AADB2C.Group(x); }).ToList();

            return b2cGroups;
        }

        public async Task<AADB2C.Group> GetGroup(string groupId)
        {
            var group = await _graphClient.Groups[groupId].GetAsync();
            var b2cGroup = group != null ? new AADB2C.Group(group) : new AADB2C.Group();

            return b2cGroup;
        }

        private async Task<List<string>> GetGrupMembersId(string groupId)
        {
            var users = await _graphClient.Groups[groupId].Members.GetAsync(
                requestConfiguration =>
                {
                    requestConfiguration.QueryParameters.Select = _userQueryProperties;
                });

            var members = users != null && users.Value != null ? users.Value.Select(x => { return x.Id; }).ToList() : new List<string>();
            return members;
        }

        public async Task<List<AADB2C.User>> GetUsers()
        {
            var users = await _graphClient.Users.GetAsync(
                requestConfiguration =>
                {
                    requestConfiguration.QueryParameters.Select = _userQueryProperties;
                });

            var groups = await this.GetGroups();
            var adminGroup = groups.Where(x => string.Equals(x.DisplayName, _adminGroupDisplayName, StringComparison.OrdinalIgnoreCase)).First();
            var adminGroupMembers = await this.GetGrupMembersId(adminGroup.Id);

            var b2cUsers = new List<AADB2C.User>();
            if (users != null && users.Value != null)
                b2cUsers = users.Value.Select(x => { return new AADB2C.User(x, adminGroupMembers); }).ToList();

            return b2cUsers;
        }

        public async Task<AADB2C.User> GetUser(string userId)
        {

            var user = await _graphClient.Users[userId].GetAsync(
                requestConfiguration =>
                {
                    requestConfiguration.QueryParameters.Select = _userQueryProperties;
                });

            var groups = await this.GetGroups();
            var adminGroup = groups.Where(x => string.Equals(x.DisplayName, _adminGroupDisplayName, StringComparison.OrdinalIgnoreCase)).First();
            var adminGroupMembers = await this.GetGrupMembersId(adminGroup.Id);

            var b2cUser = new AADB2C.User();
            if (user != null)
                b2cUser = new AADB2C.User(user, adminGroupMembers);
            
            return b2cUser;
        }

        public async Task<AADB2C.User> CreateUser(AADB2C.User user)
        {
            var password = Utils.GeneratePassword();
            var graphUser = new Microsoft.Graph.Models.User()
            {
                AccountEnabled = user.AccountEnabled,
                DisplayName = user.DisplayName,
                Identities = user.Identities.Select(x =>
                {
                    return new ObjectIdentity
                    {
                        SignInType = x.SingInType,
                        IssuerAssignedId = x.IssuerAssignedId,
                        Issuer = _configuration["AzureAdB2C:Domain"],
                    };
                }).ToList(),
                PasswordProfile = new PasswordProfile()
                {
                    Password = password,
                    ForceChangePasswordNextSignIn = true,
                },
            };
            graphUser = await _graphClient.Users.PostAsync(graphUser);

            if (graphUser != null)
            {
                user = await this.GetUser(graphUser.Id);
                user.Password = password;
            }

            return user;
        }
    }
}
