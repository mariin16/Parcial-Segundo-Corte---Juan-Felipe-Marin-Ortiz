const express = require('express');
const router = express.Router();
const candidatosDao = require('../dao/candidatos.dao');

router.post('/', candidatosDao.registrarCandidato);
router.get('/', candidatosDao.getCandidatos);

module.exports = router;