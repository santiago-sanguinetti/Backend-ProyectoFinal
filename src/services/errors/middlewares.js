import EErrors from "./enums.js";
export default (error, req, res, next) => {
    console.log(error.cause);
    let httpStatusCode;
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            httpStatusCode = 400;
            break;
        case EErrors.DATABASE_ERROR:
            httpStatusCode = 500;
            break;
        case EErrors.EMPTY_CART_ERROR:
            httpStatusCode = 400;
            break;
        case EErrors.INSUFFICIENT_STOCK_ERROR:
            httpStatusCode = 400;
            break;
        default:
            httpStatusCode = 500;
    }
    res.status(httpStatusCode).send({
        status: "error",
        error: error.name,
        message: error.message,
    });
};