const allowedStatusTransitions = {
    PLACED : ['CONFIRMED'],
    CONFIRMED : ['OUT_FOR_DELIVERY'],
    OUT_FOR_DELIVERY : ['DELIVERED'],
    DELIVERED : []
}

function canTransition (current , next ){
    return allowedStatusTransitions[current]?.includes(next);
}

module.exports = { canTransition }