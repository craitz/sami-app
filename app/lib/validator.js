// ============================================================================
// Autor: Camilo Raitz da Silva
// Descrição: módulo executa a validação toda vez que uma requisição é feita
// ============================================================================

'use strict';

module.exports.paramValidation = function (joi) {
    return function (req, res, next) {
        // permite campos desconhecidos por default.
        let options = {
            allowUnknown: true
        };

        // obtém o esquema de validação
        let validation = req.route.spec.validation;

        // pula validação se não houver esquema
        if (!validation) {
            return next();
        }

        let validProperties = ['body', 'query', 'params'];

        // valida todas as propriedades
        for (let i in validation) {
            if (validProperties.indexOf(i) < 0) {
                throw new Error('Parâmetros não suportado');
            } else {
                if (req[i] === undefined) {
                    res.send(400, {
                        message: 'Bad Request',
                        cause: 'A requisição está vazia'
                    });

                    return;
                }

                let result = joi.validate(req[i], validation[i], options);

                if (result.error) {
                    res.send(400, {
                        message: 'Bad Request',
                        cause: result.error.details[0].message
                    });

                    return;
                } else {
                    console.log('Parâmetros validados com sucesso');
                }
            }
        }

        next();
    };
};