class AbstractException extends Error{
    constructor(method) {
        super('Classe abstrata não pode ser instanciada diretamente. ['+method.constructor.name+']');
    }
}

class AbstractMethodException extends Error{
    constructor(method) {
        super('Este método deve ser implementado. ['+method.constructor.name+']');
    }
}

export {AbstractException, AbstractMethodException};