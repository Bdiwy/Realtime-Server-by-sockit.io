document.addEventListener('DOMContentLoaded', function() {
    const statusText = document.getElementById('statusText');
    let dots = '';

    setInterval(function() {
        if (dots.length < 3) {
            dots += '.';
        } else {
            dots = '';
        }
        statusText.textContent = 'running' + dots;
    }, 500);
});
