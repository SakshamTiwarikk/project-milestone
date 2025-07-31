const express = require("express");
const router = express.Router();
const pool = require("../db");

// 1. GET all departments with product count
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.id,
        d.name,
        COUNT(p.id) AS product_count
      FROM departments d
      LEFT JOIN products p ON d.id = p.department_id
      GROUP BY d.id, d.name
      ORDER BY d.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. GET specific department details
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, name FROM departments WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 3. GET all products in a department
router.get("/:id/products", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
         p.*, 
         d.name AS department_name
       FROM products p
       JOIN departments d ON p.department_id = d.id
       WHERE d.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No products found for this department" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products by department:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
