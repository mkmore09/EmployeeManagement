import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeeList from "./pages/EmployeeList";
import EmployeeCreate from "./pages/EmployeeCreate";
import EmployeeEdit from "./pages/EmployeeEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LIST */}
        <Route path="/" element={<EmployeeList />} />

        {/* CREATE */}
        <Route path="/employee/create" element={<EmployeeCreate />} />

        {/* EDIT */}
        <Route path="/employee/edit/:id" element={<EmployeeEdit />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;