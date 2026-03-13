const express = require("express")
const router = express.Router()

const {
 createProject,
 getProjects,
 applyToProject,
 acceptApplicant,
 rejectApplicant
} = require("../controllers/projectController")

const authMiddleware = require("../middleware/authMiddleware")

router.post("/create", authMiddleware, createProject)

router.get("/", authMiddleware, getProjects)

router.post("/:id/apply", authMiddleware, applyToProject)

router.patch("/:id/accept/:userId", authMiddleware, acceptApplicant)

router.patch("/:id/reject/:userId", authMiddleware, rejectApplicant)

module.exports = router