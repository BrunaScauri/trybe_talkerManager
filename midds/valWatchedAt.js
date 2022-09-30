module.exports = (req, res, next) => {
const { talk: { watchedAt } } = req.body;
const validatesDateFormat = /^(\d{2})\/(\d{2})\/(\d{4})$/;
if (!watchedAt.match(validatesDateFormat)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
    }
    next();
};
