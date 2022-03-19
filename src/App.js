import { Route, Routes } from "react-router-dom";
import Forms from "./components/Forms";
function App() {
  return (
    <Routes>
      <Route path="/reset-password" element={<Forms/>}/>
    </Routes>
  );
}

export default App;
