module.exports ={
    calculateDeliveryEstimation :  (orderPlacementDate) => {
    const minDeliveryDate = new Date(orderPlacementDate);
    minDeliveryDate.setDate(orderPlacementDate.getDate() + 3);

    const maxDeliveryDate = new Date(orderPlacementDate);
    maxDeliveryDate.setDate(orderPlacementDate.getDate() + 9);

    const formatOptions = { weekday: 'short', day: '2-digit', month: 'short' };
    const minDeliveryDateString = minDeliveryDate.toLocaleDateString('en-US', formatOptions);
    const maxDeliveryDateString = maxDeliveryDate.toLocaleDateString('en-US', formatOptions);

    return `${minDeliveryDateString} - ${maxDeliveryDateString}`;
}
}