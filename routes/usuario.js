var jwt = require('jsonwebtoken'); //npm install jsonwebtoken --save  -- la pag jwt.io puedo ver info
//var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');


var express = require('express');

var app = express();
//cargar libreria npm install bcryptjs --save
var bcrypt = require('bcryptjs');

var Usuario = require('../models/usuario');

//===================
// Obtenet rodos los usuarios
//===================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error BD de usuarios',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });

            })


});

// //===================
// // Verificar Token - Middleware
// //===================
// app.use('/', (req, res, next) => {

//     var token = req.query.token;

//     jwt.verify(token, SEED, (err, decoded) => {

//         if (err) { // Al tener este control aca ya todo lo que sigue no funciona, ni alta modificacion nada
//             return res.status(401).json({
//                 ok: false,
//                 mensaje: 'Token no valido',
//                 errors: err
//             });
//         }

//         next(); // indica que esta todo bien y que continue

//     });

// });


//===================
// Actualizar usuarios
//===================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar al usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario no encontrado',
                errors: { message: 'No existe el usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al crear usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = '******';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });

    });



});



//===================
// Crear nuevo usuario
//===================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'erroral crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });
    });



});

//===================
// Eliminar usuario
//===================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe usuario con ese ID',
                errors: { message: 'no existe usuario con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});

module.exports = app;