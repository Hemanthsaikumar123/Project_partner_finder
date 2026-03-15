import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import ProjectFeed from "./pages/ProjectFeed"
import CreateProject from "./pages/CreateProject"
import ProjectDetails from "./pages/ProjectDetails"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProjectFeed />} />

        <Route path="/create-project" element={<CreateProject />} />

        <Route path="/projects/:id" element={<ProjectDetails />} />

      </Routes>

    </BrowserRouter>

  )

}

export default App