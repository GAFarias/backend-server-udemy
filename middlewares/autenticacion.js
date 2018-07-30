var jwt = require('jsonwebtoken'); //npm install jsonwebtoken --save  -- la pag jwt.io puedo ver info
var SEED = require('../config/config').SEED;

//===================
// Verificar Token - Middleware
//===================
exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) { // Al tener este control aca ya todo lo que sigue no funciona, ni alta modificacion nada
            return res.status(401).json({
                ok: false,
                mensaje: 'Token no valido',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        next(); // indica que esta todo bien y que continue


    });

};