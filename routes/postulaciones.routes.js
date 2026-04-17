const express = require('express');
const router = express.Router();
const postulacionesDao = require('../dao/postulaciones.dao');

router.post('/', postulacionesDao.registrarPostulacion);
router.get('/:id', postulacionesDao.consultarPostulacion);
router.get('/ofertas/all', postulacionesDao.getOfertas);

module.exports = router;