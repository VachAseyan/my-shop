const API_URL = "https://fakestoreapi.com/products";

const fetchProducts = async () => {
    return fetch(API_URL)
        .then(data => data.json())
        .then(data => data)
}

export { fetchProducts, API_URL };