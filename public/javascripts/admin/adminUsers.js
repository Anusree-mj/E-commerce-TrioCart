function toggleIsBlocked() {
    let isBlockedElement = document.getElementById('isBlocked');
    
    if (isBlockedElement) {
        let isBlockedValue = isBlockedElement.textContent.trim();
        isBlockedValue = isBlockedValue === 'true'; // Convert to boolean
        
        // Toggle the status
        isBlockedValue = !isBlockedValue;

        // Update the content in the element
        isBlockedElement.textContent = isBlockedValue.toString();
        
        console.log(`User isBlocked status toggled to: ${isBlockedValue}`);
    } else {
        console.error(`Element with ID isBlocked not found.`);
    }
}
