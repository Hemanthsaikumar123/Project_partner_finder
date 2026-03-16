import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../api/axios"
import { AuthContext } from "../context/AuthContext"

function Register() {

  const [form, setForm] = useState({
    name: "",
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

      if (!form.name || !form.email || !form.password) {
        alert("Please fill in all required fields")
        return
      }

      const res = await API.post("/auth/register", form)

      login(res.data)

      navigate("/dashboard")

    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed"
      alert(message)
    }

  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full mb-4 p-2 border rounded"
          value={form.name}
          required
          onChange={handleChange}
        />

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

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Register
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? {" "}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Login
          </Link>
        </p>

      </form>

    </div>
  )
}

export default Register