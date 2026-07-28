# UserDirectoryApi

Backend API for the User Directory project.

Built with:
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core + SQLite
- Auth0 JWT authentication

## Folder Structure

```text
UserDirectoryApi/
  Program.cs                         # App setup (services, auth, middleware, DB)
  appsettings.json                   # Main configuration (Auth0, DB path)
  appsettings.Development.json       # Development overrides
  UserDirectoryApi.csproj            # API project file (.NET 8 + packages)

  Controllers/
    UsersController.cs               # User CRUD endpoints

  Models/
    User.cs                          # User entity model

  Data/
    UserDirectoryDbContext.cs        # EF Core DbContext
    DbInitializer.cs                 # Optional seed/init logic

  Migrations/
    ...                              # EF Core migration files

  Properties/
    launchSettings.json              # Local launch profiles/ports

  UserDirectoryApi.Tests/
    UsersControllerTests.cs          # Backend unit tests
    UserDirectoryApi.Tests.csproj    # Test project file
```

## How Request Flow Works

1. `Program.cs` configures services, Auth0 JWT auth, CORS, and EF Core.
2. Incoming HTTP requests hit `Controllers/UsersController.cs`.
3. Controller uses `Data/UserDirectoryDbContext.cs` to read/write SQLite.
4. Data is returned as JSON responses.

## Main Endpoints

- `GET /api/users`
- `GET /api/users/{id}`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`
- Swagger UI: `/swagger`

## Local Commands

```bash
# from UserDirectoryApi/
dotnet restore
dotnet run --launch-profile http
```

```bash
# run backend tests
cd UserDirectoryApi.Tests
dotnet test
```
