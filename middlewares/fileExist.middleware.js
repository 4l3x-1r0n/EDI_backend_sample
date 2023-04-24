const fileExist = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: "No hay ningún archivo",
        });
    }

    next();
};
module.exports = {
    fileExist,
};
