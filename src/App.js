import Home from "./pages/Home/Home";
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider
      maxSnack={3} // Optional: Adjust based on your needs
      preventDuplicate={true} // Optional: Prevent duplicate snackbars
      autoHideDuration={3000} // Optional: Duration in milliseconds for auto-hide
    >
      <div>
        <Home />
      </div>
    </SnackbarProvider>
  );
}

export default App;
