const { Rating, User, Store, sequelize } = require('../models');


async function getDashboard(req, res) {
  try {
    const ownerId = req.user.id;

    const store = await Store.findOne({ where: { ownerId } });
    if (!store) {
      return res.status(404).json({ message: 'No store is assigned to your account yet' });
    }

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });

    const result = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[sequelize.fn('AVG', sequelize.col('value')), 'avg']],
      raw: true,
    });
    const averageRating = result?.avg ? parseFloat(result.avg).toFixed(1) : '0.0';

    res.json({ store, ratings, averageRating });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
}

module.exports = { getDashboard };
