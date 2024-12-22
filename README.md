# Publications Dashboard

This project allows users to view and filter a list of publications, sort them by different criteria, and paginate through large datasets. The dashboard also provides detailed information about each publication in a modal view.

## Features

- **Search**: Search publications by name with real-time filtering.
- **Filters**: Apply multiple filters based on different fields.
- **Sorting**: Sort publications by name, date, or other criteria.
- **Pagination**: Navigate through pages of publications with support for "entries per page".
- **Detailed View**: Click on a publication to view its details in a modal window.
- **Responsive**: The application is quite responsive and works on both desktop and mobile devices.

## Technologies Used

- **React**: Frontend UI framework.
- **TypeScript**: Static type checking for JavaScript.
- **React Query**: Data fetching and caching for publications.
- **Tailwind CSS**: Utility-first CSS framework for fast styling.
- **Lodash**: Utility library, used for debouncing search input.
- **Jest**: Testing framework designed
- **testing-library/react**: Utility library, used for testing react components.

## Installation and Setup

To run this project locally, follow the steps below.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) - JavaScript runtime for building and running the application.

### Environment

The application relies on environment variables that need to be set up in a `.env` file. These variables provide sensitive credentials and API configurations for the app to function correctly.

#### `.env` File Configuration

In the root directory of your project, create a `.env` file and define the following environment variables:

```env
VITE_CLIENT_ID=<your-client-id>
VITE_CLIENT_SECRET=<your-client-secret>
VITE_BASE_URL_API=https://api.foleon.com
```

### Install dependencies

If you have Yarn installed, run:

```
yarn
```

### Running the Application

To start the application in development mode, run:

```
yarn dev
```

This will launch the app at http://localhost:5173.

### Linting

To check for code style issues, run:

```
yarn lint
```

### Running Tests

To run unit tests, use:

```
yarn test
```

### Production build

Refer to https://vite.dev/guide/build
