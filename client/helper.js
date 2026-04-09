const handleError = (message) => {
    const errorElement = document.querySelector('#errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

const hideError = () => {
    const errorElement = document.querySelector('#errorMessage');
    errorElement.style.display = 'none';
    errorElement.textContent = '';
}

const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    hideError();

    if(result.redirect) {
        window.location = result.redirect;
    }

    if(result.error){
        handleError(result.error);
    }

    if(handler) {
        handler(result);
    }
};

module.exports = {
    handleError,
    hideError,
    sendPost
};