import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../api/axios"

function ProjectFeed() {

  const [projects, setProjects] = useState([])

  const fetchProjects = async () => {

    try {

      const res = await API.get("/projects")

      setProjects(res.data)

    } catch (err) {

      console.log(err)

    }

  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const applyToProject = async (id) => {

    try {

      await API.post(`/projects/${id}/apply`)

      alert("Application sent")

    } catch (err) {

      alert(err.response.data.message || "Failed to apply")

    }

  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      <div className="grid grid-cols-3 gap-6">

        {projects.map((project) => (

          <div
            key={project._id}
            className="border p-4 rounded shadow"
          >

            <h2 className="text-xl font-bold">
              {project.title}
            </h2>

            <p className="text-gray-600 mb-2">
              {project.description}
            </p>

            <div className="mb-2">

              {project.requiredSkills?.map((skill, i) => (
                <span
                  key={i}
                  className="mr-2 text-sm bg-gray-200 px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}

            </div>

            <div className="flex gap-3 mt-3">

              <Link
                to={`/projects/${project._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                View Details
              </Link>

            </div>

            <br />

            <button
              onClick={() => applyToProject(project._id)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Apply
            </button>


          </div>

        ))}

      </div>

    </div>
  )

}

export default ProjectFeed