const { getAllOrdersService } = require("../service/admin.service");

const getAllOrdersController = async (req, res, next) => {
    try {
        const { page , limit, status } = req.pagination;
        const orders = await getAllOrdersService(page, limit, status);
        return res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
}

module.exports = { getAllOrdersController }