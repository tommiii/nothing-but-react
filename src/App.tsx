import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./containers/dashboard";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    </>
  );
}

export default App;
