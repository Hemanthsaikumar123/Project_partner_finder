import { useEffect, useState } from "react"
import API from "../api/axios"

function MyProjects() {

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchProjects = async () => {

    const res = await API.get("/projects/my-projects")

    setProjects(res.data)

  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const accept = async (projectId, applicant) => {

    setLoading(true)

    const userId = applicant?.user?._id || applicant?.user

    await API.patch(`/projects/${projectId}/accept/${userId}`)

    fetchProjects()

    setLoading(false)
  }

  const reject = async (projectId, applicant) => {

    const userId = applicant?.user?._id || applicant?.user
    const applicantName = applicant?.user?.name || "Applicant"

    const res = await API.patch(`/projects/${projectId}/reject/${userId}`)

    alert(res.data?.message || `${applicantName} rejected`)

    fetchProjects()

  }

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">My Projects</h1>

      {projects.map(project => (

        <div key={project._id} className="border p-4 mb-6 rounded">

          <h2 className="text-xl font-bold">{project.title}</h2>

            <p className="text-gray-600 mt-1">
              {project.description}
            </p>

            <div className="mt-2">
              {project.requiredSkills?.map((skill, i) => (
                <span
                  key={i}
                  className="mr-2 text-sm bg-gray-200 px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>

          <p className="mt-2 text-sm">
            Members: {project.members?.length} / {project.maxMembers}
          </p>
          
        {project.members?.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold mb-2">Team Members</h3>

          <div className="space-y-2">
            {project.members.map(member => (
              <div key={member._id} className="rounded border p-3">
                <p className="font-medium">{member.name}</p>
                {member.email && <p className="text-sm text-gray-600">{member.email}</p>}
              </div>
            ))}
          </div>
        </div>)}


          <h3 className="mt-3 font-bold">Applicants</h3>
          {project.applicants?.filter(a => a.status === "pending").length === 0 && (
            <p className="text-gray-500 mt-2">No pending applicants</p>
          )}
          {project.applicants
          ?.filter(app => app.status === "pending")
          .map(app => (

            <div
              key={app.user?._id || app.user}
              className="flex justify-between items-center mt-2"
            >

              <span>{app.user?.name || "Unknown applicant"}</span>

              <div className="flex gap-2">

                <button
                  disabled={loading}
                  onClick={() => accept(project._id, app)}
                  className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  Accept
                </button>

              <button
                disabled={loading}
                onClick={() => reject(project._id, app)}
                className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Reject
              </button>

              </div>

            </div>

          ))}

        </div>

      ))}

    </div>

  )

}

export default MyProjects