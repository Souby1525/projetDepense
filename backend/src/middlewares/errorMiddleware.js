export const notFound = (req, res, next) => {
  const error = new Error(`Route introuvable: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Erreur serveur";
  let errors = err.errors;

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Identifiant invalide";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Erreur de validation";
    errors = Object.values(err.errors).map((error) => error.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
