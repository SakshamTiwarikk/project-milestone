const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all products
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        products.*, 
        departments.name AS department_name
      FROM products
      JOIN departments ON products.department_id = departments.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT products.*, departments.name AS department_name
       FROM products
       JOIN departments ON products.department_id = departments.id
       WHERE products.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
