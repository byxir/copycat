import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatedRoutes } from "./AnimatedRoutes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AnimatedRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "hsl(var(--card))",
              color: "hsl(var(--card-foreground))",
              border: "1px solid hsl(var(--border))",
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
