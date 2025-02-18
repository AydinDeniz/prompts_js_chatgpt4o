
// Debounce function: delays function execution until after a specified wait period
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Throttle function: enforces a limit on function execution frequency
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Example usage
// Debounce example: resize event
window.addEventListener('resize', debounce(() => {
    console.log('Resize event debounced');
}, 500));

// Throttle example: scroll event
window.addEventListener('scroll', throttle(() => {
    console.log('Scroll event throttled');
}, 1000));
