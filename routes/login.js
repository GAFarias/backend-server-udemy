var express = require('express'); //cargar libreria npm install bcryptjs --save
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); //npm install jsonwebtoken --save  -- la pag jwt.io puedo ver info

var SEED = require('../config/config').SEED;
var app = express();
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar al usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) { //devuelve true o false
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
            });
        }


        // Si llego hasta aca esta todo ok
        // CREAR UN TOKEN
        usuarioDB.password = '***'; // borro la contraseña del objeto
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) //expira en 4 horas (14400 seg)

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            if: usuarioDB._id
        });


    });


})

module.exports = app;