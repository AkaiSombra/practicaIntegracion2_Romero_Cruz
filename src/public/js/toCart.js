async function getProducts() {
    try {
        const res = await fetch(`http://localhost:8080/api/products/all`)
        const dataJson = await res.json()
        return dataJson
    } catch (error) {
        console.error('Error fetching products:', error)
        throw error
    }
}

async function addToCart(productId) {
    try {
        const cartId = 1 // Puedes ajustar el ID del carrito según tus necesidades
        const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Puedes enviar más datos en el cuerpo de la solicitud si es necesario
            // body: JSON.stringify({ key: 'value' }),
        })

        if (!response.ok) {
            throw new Error(`Error adding product to cart. Status: ${response.status}`)
        }

        console.log(`Producto con ID ${productId} agregado al carrito.`)
    } catch (error) {
        console.error('Error adding product to cart:', error)
    }
}

async function displayProducts() {
    try {
        const products = await getProducts()
        const container = document.getElementById("productContainer")

        products.forEach(product => {
            const card = document.createElement("div")
            card.classList.add("product-card")

            const thumbnail = document.createElement("img")
            thumbnail.src = product.thumbnail
            thumbnail.alt = product.title
            thumbnail.classList.add("product-thumbnail")

            const title = document.createElement("div")
            title.textContent = product.title
            title.classList.add("product-title")

            const description = document.createElement("div")
            description.textContent = product.description
            description.classList.add("product-description")

            const price = document.createElement("div")
            price.textContent = `$${product.price.toFixed(2)}`
            price.classList.add("product-price")

            const stockStatus = document.createElement("div")
            stockStatus.textContent = product.stock ? "In Stock" : "Out of Stock"
            stockStatus.classList.add(product.stock ? "product-stock-status" : "product-out-of-stock")

            const addButton = document.createElement("button")
            addButton.textContent = "Agregar"
            addButton.classList.add("add-button")
            
            addButton.addEventListener("click", () => {
                addToCart(product.id)
            })

            card.appendChild(thumbnail)
            card.appendChild(title)
            card.appendChild(description)
            card.appendChild(price)
            card.appendChild(stockStatus)
            card.appendChild(addButton)

            container.appendChild(card)
        })
    } catch (error) {
        console.error('Error displaying products:', error)
    }
}


document.addEventListener("DOMContentLoaded", () => {
    displayProducts()
})
