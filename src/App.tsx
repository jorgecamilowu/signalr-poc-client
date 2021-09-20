import { Album } from "./components";
import { signalRHub } from "./store/middlewares";

function App() {
  return <Album connection={signalRHub} />;
}

export default App;
