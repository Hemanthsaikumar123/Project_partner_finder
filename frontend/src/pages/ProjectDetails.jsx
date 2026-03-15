import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../api/axios"

function ProjectDetails() {

  const { id } = useParams()

  const [project, setProject] = useState(null)

  const fetchProject = async () => {

    try {

      const res = await API.get(`/projects/${id}`)

      setProject(res.data)

    } catch (err) {

      console.log(err)

    }

  }

  useEffect(() => {
    fetchProject()
  }, [])

  const applyToProject = async () => {

    try {

      await API.post(`/projects/${id}/apply`)

      alert("Application sent")

    } catch (err) {

      alert(err.response.data.message || "Failed to apply")

    }

  }

  if (!project) return <p className="p-8">Loading...</p>

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-4">
        {project.title}
      </h1>

      <p className="mb-4">
        {project.description}
      </p>

      <h3 className="font-bold mb-2">Required Skills</h3>

      <div className="mb-4">

        {project.requiredSkills?.map((skill, i) => (
          <span
            key={i}
            className="mr-2 bg-gray-200 px-2 py-1 rounded"
          >
            {skill}
          </span>
        ))}

      </div>

      <p className="mb-4">
        Members: {project.membersCount} / {project.maxMembers}
      </p>

      <button
        onClick={applyToProject}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Apply to Project
      </button>

    </div>

  )

}

export default ProjectDetails