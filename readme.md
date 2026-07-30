------------------------------------------------------------------------------------
Project Overview
------------------------------------------------------------------------------------
This project is a small full-stack user directory app built with React and TypeScript on the front end and .NET 8  Web API with SQLite on the back end. Users can sign in through Auth0, view a list of users, and add new users through a simple web interface. The app is container-friendly and can be run locally or with Docker.

------------------------------------------------------------------------------------
Execution
------------------------------------------------------------------------------------

There are 2 ways to run this application as below,


1. To run with docker, please install docker desktop and then run this command in the root folder, 
		docker-compose -f docker-compose.dev.yml up -d

2. Run without docker by this command in the root folder, 
		.\run-local.bat
		
		
		
After either way of above is run successfully, open browser and navigate to http://localhost:5173/


The application is protected with Auth0 so login is required. You can sign up a new account when you are directed to Auth0 login page.

-------------------------------------------------------------------------------------
Code Structure
-------------------------------------------------------------------------------------

There are two folders UserDirectoryApp and UserDirectoryApi

UserDirectoryApp contains the front end code developed with React + TypeScript

UserDirectoryApi contains the back end code developed with .NET 8 Web API

SQLite is consumed to store the data so data is stored in a SQLLite db file in UserDirectoryApi

The application is protected with Auth0 so login is required.


1. UserDirectoryApp

Frontend application for the User Directory project.

Built with:
- React + TypeScript
- Vite
- Auth0 (login/logout)

Folder Struture
UserDirectoryApp/
  src/
    main.tsx                 # App entry point + Auth0Provider setup
    App.tsx                  # Main layout and Add/List view switching
    api.ts                   # API calls to backend (/api/users)
    types.ts                 # Shared TypeScript types
    App.css                  # App-specific styles
    index.css                # Global styles

    LogoutButton.tsx         # Shows user info and logout action

    pages/
      WelcomePage.tsx        # Landing page for unauthenticated users
      AddUser.tsx            # Form to create a new user
      ListUsers.tsx          # Loads and displays users
      NotFoundPage.tsx       # Fallback page component

    test/
      setup.ts               # Vitest setup (jest-dom matchers)

    api.test.ts              # Unit tests for API helper
    LogoutButton.test.tsx    # Unit tests for Logout button

The React app is structured as a small, page-based SPA with clear separation of concerns: App.tsx manages overall view state, the pages folder holds feature-specific UI for adding and listing users, api.ts centralizes backend communication, and main.tsx initializes the app and wires up the Auth0 provider. This keeps the code simple, easier to maintain, and easier to extend as the app grows.

2. UserDirectoryApi

Backend API for the User Directory project.

Built with:
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core + SQLite
- Auth0 JWT authentication

Folder Struture
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
    
  Services/
    UserService.cs                   # Operation on Users

  Migrations/
    ...                              # EF Core migration files

  Properties/
    launchSettings.json              # Local launch profiles/ports

  UserDirectoryApi.Tests/
    UsersControllerTests.cs          # Backend unit tests
    UserDirectoryApi.Tests.csproj    # Test project file
	

With the structure above, there is clear separation amongst the HTTP layer (UsersController.cs),  domain entity (User.cs), domain logic (UserService.cs) persistence concerns (UserDirectoryDbContext.cs). 



------------------------------------------------------------------------------------
Docker
------------------------------------------------------------------------------------

2 containers would be running as below

1. Front end container hosting the React webapp. Port Number is 5173
2. Back end container hosting the .NET web api. Port Number is 5096

Front end container access the back end api via `http://api:5096` through the internal bridge network

To stop/remove containers, please run this command in the root folder,
    docker compose -f docker-compose.dev.yml down

------------------------------------------------------------------------------------
OTHERS
------------------------------------------------------------------------------------

1. Application is developed with the assistant of Github Copilot
2. Usually env file is not commited to the repo, however for the convenience of code reviewers to run this repo locally, env files are committed
	


