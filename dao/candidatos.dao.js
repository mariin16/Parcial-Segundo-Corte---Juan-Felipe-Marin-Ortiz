const db = require('../services/mysql.service');

const registrarCandidato = async (req, res) => {
  try {
    const { nombre, email } = req.body;
    if (!nombre || !email)
      return res.status(400).json({ error: 'nombre y email son requeridos' });

    const [result] = await db.query(
      'INSERT INTO candidatos (nombre, email, estado) VALUES (?, ?, "activo")',
      [nombre, email]
    );
    res.status(201).json({ id: result.insertId, nombre, email, estado: 'activo' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCandidatos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM candidatos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registrarCandidato, getCandidatos };