import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

function Navbar() {

  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {

    logout()
    navigate("/login")

  }

  return (

    <div className="flex justify-between items-center bg-gray-900 text-white px-8 py-4">

      <Link to="/dashboard" className="text-xl font-bold">
        DevCollab
      </Link>

      <div className="flex gap-4 items-center">

        {user && <Link
          to="/dashboard"
          className="hover:text-gray-300"
        >
          Projects
        </Link> }

        {user && <Link
          to="/create-project"
          className="hover:text-gray-300"
        >
          Create Project
        </Link>}

        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}

      </div>

    </div>

  )

}

export default Navbar