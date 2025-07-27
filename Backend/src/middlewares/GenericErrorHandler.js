import ApiError from "../error/ApiError.js"; // Düzgün yazım

const GenericErrorHandler = (err, req, res, next) => {
    // Eğer hata ApiError değilse, konsola yazdır
    if (!(err instanceof ApiError)) {
        console.error(err); // Hataları konsola yazdır
    }

    // Validation hatası mesajını temizle
    if (/\w+ validation failed: \w+/i.test(err.message)) {
        err.message = err.message.replace(/\w+ validation failed: \w+/i, "");
    }

    // Yanıtı gönder
    res.status(err.statusCode || 500).json({
        status: err.statusCode || 500,
        error: err.message || "Bir hata oluştu.",
        code: err.code || "INTERNAL_ERROR",
    });
};

export default GenericErrorHandler;