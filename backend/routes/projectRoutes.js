const express = require("express")
const router = express.Router()

const {
  createProject,
  getProjects,
  applyToProject,
  acceptApplicant,
  rejectApplicant,
  getProjectById,
  getMyProjects,
  getAppliedProjects
} = require("../controllers/projectController")

const authMiddleware = require("../middleware/authMiddleware")

router.post("/create", authMiddleware, createProject)

router.get("/", authMiddleware, getProjects)

router.post("/:id/apply", authMiddleware, applyToProject)

router.patch("/:id/accept/:userId", authMiddleware, acceptApplicant)

router.patch("/:id/reject/:userId", authMiddleware, rejectApplicant)

router.get("/my-projects", authMiddleware, getMyProjects)

router.get("/applied", authMiddleware, getAppliedProjects)

router.get("/:id", authMiddleware, getProjectById)


module.exports = router