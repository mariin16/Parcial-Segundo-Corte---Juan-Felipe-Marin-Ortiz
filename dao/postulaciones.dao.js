const dbEmpleos = require('../services/mysql2.service');
const dbTalento = require('../services/mysql.service');

const registrarPostulacion = async (req, res) => {
  try {
    const { candidato_id, oferta_id } = req.body;
    if (!candidato_id || !oferta_id)
      return res.status(400).json({ error: 'candidato_id y oferta_id son requeridos' });

    // Regla 1: candidato existe y está activo
    const [candidato] = await dbTalento.query(
      'SELECT * FROM candidatos WHERE id = ? AND estado = "activo"',
      [candidato_id]
    );
    if (!candidato[0])
      return res.status(400).json({ error: 'Candidato no existe o no está activo' });

    // Regla 2: candidato tiene al menos una habilidad requerida con nivel mínimo
    const [habilidades] = await dbTalento.query(
      'SELECT habilidad_id, nivel FROM candidato_habilidades WHERE candidato_id = ?',
      [candidato_id]
    );
    const [requeridas] = await dbEmpleos.query(
      'SELECT habilidad_id, nivel_minimo FROM offer_skill WHERE oferta_id = ?',
      [oferta_id]
    );

    const cumple = requeridas.some(req =>
      habilidades.some(h => h.habilidad_id === req.habilidad_id && h.nivel >= req.nivel_minimo)
    );
    if (!cumple)
      return res.status(400).json({ error: 'El candidato no cumple las habilidades requeridas' });

    // Regla 3: no puede postularse dos veces
    const [result] = await dbEmpleos.query(
      'INSERT INTO postulation (candidato_id, oferta_id) VALUES (?, ?)',
      [candidato_id, oferta_id]
    );
    res.status(201).json({ id: result.insertId, candidato_id, oferta_id, estado: 'pendiente' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ error: 'El candidato ya se postuló a esta oferta' });
    res.status(500).json({ error: err.message });
  }
};

const consultarPostulacion = async (req, res) => {
  try {
    const [rows] = await dbEmpleos.query(
      'SELECT * FROM postulation WHERE id = ?',
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Postulación no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOfertas = async (req, res) => {
  try {
    const [rows] = await dbEmpleos.query('SELECT * FROM offer');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registrarPostulacion, consultarPostulacion, getOfertas };