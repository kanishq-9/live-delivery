const { getAssignedOrdersService } = require("../service/delivery.service")

const getAssignedOrdersController = async (req, res, next) => {
    try {
        const { page, limit, status } = req.pagination;
        const orders = await getAssignedOrdersService(req.user.id, page, limit, status);
        return res.status(200).json(orders);
    } catch (error) {
        next(error)
    }
}

module.exports = { getAssignedOrdersController }