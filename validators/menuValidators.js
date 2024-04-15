const validIds = ["1", "2", "3", "4", "5", "6"];

const validateProductId = (productId) => validIds.includes(productId);

module.exports = { validateProductId };
