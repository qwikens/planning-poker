import viteLogo from "/vite.svg";
import "./App.css";
import "./global.css";
import reactLogo from "./assets/react.svg";
import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col items-center justify-center">
            <img src={viteLogo} className="logo" alt="Vite logo" />
            <img src={reactLogo} className="logo react" alt="React logo" />
          </div>
          <Button>Click</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
