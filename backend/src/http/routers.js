const express = require("express");

function createHttpRouter() {
  const router = express.Router();

  router.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "task-flow-manager-backend" });
  });

  router.get("/api/requests", (_req, res) => {
    res.json({
      items: [],
      message: "Requests API skeleton is ready"
    });
  }); 
  return router;
}

module.exports = {
  createHttpRouter
};
