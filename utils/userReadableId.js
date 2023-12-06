const  generateUserReadableId=(objectId)=>{
    const last6Chars = objectId.slice(-10); // Get the last 6 characters
    const decimalNumber = parseInt(last6Chars, 16); // Convert hexadecimal to decimal
    const userReadableId = decimalNumber.toString(36).toUpperCase(); // Convert decimal to base36

    return userReadableId;
}

module.exports={
    generateUserReadableId
}