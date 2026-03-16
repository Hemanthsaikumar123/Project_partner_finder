import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../api/axios"
import { AuthContext } from "../context/AuthContext"

function Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const res = await API.post("/auth/login", form)

      login(res.data)

      navigate("/dashboard")

    } catch (err) {
      alert("Login failed")
    }

  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={form.email}
          required
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={form.password}
            required
          onChange={handleChange}
        />

        <button className="w-full bg-green-600 text-white p-2 rounded">
          Login
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account? {" "}
          <Link to="/register" className="font-medium text-green-600 hover:underline">
            Register
          </Link>
        </p>

      </form>

    </div>
  )
}

export default Login