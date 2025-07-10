module.exports = (...fields) => {
  return (req, res, next) => {
    if (!req.user || req.user.ongId == null) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const ongId = parseInt(req.user.ongId);
    for (const field of fields) {
      const value = req.params[field] ?? req.body[field] ?? req.query[field];
      if (value !== undefined && parseInt(value) !== ongId) {
        return res.status(403).json({ error: 'ONG mismatch' });
      }
    }
    next();
  };
};
