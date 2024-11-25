function showNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000); // Hide after 3 seconds
}

document.addEventListener('DOMContentLoaded', function() {
    const cart = {
        items: JSON.parse(localStorage.getItem('cartItems')) || [],
        
        addItem(product, quantity = 1) {
            const existingItem = this.items.find(item => item.name === product.name && item.image === product.image);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                product.quantity = quantity;
                this.items.push(product);
            }
            this.saveCart();
            this.updateCartDisplay();
            showNotification();
        },
        
        removeItem(productName, productImage) {
            this.items = this.items.filter(item => !(item.name === productName && item.image === productImage));
            this.saveCart();
            this.updateCartDisplay();
        },
        
        saveCart() {
            localStorage.setItem('cartItems', JSON.stringify(this.items));
        },
        
        updateCartDisplay() {
            const cartList = document.querySelector('.cart-list-item');
            const emptyCartMessage = document.querySelector('.empty-cart-message');
            const addedProductMessage = document.querySelector('.added-product-message-2');
            const viewCartButton = document.querySelector('.view-cart-button');
            const cartHeading = document.querySelector('.cart-heading');

            cartList.innerHTML = '';

            if (this.items.length === 0) {
                emptyCartMessage.style.display = 'block';
                addedProductMessage.style.display = 'none';
                viewCartButton.style.display = 'none';
                cartHeading.style.display = 'none';
            } else {
                emptyCartMessage.style.display = 'none';
                addedProductMessage.style.display = 'block';
                viewCartButton.style.display = 'block';
                cartHeading.style.display = 'block';
                const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
                addedProductMessage.textContent = `Đã thêm ${totalItems} sản phẩm vào giỏ hàng`;
                addedProductMessage.setAttribute("style","margin: 0px; padding-top: 7px")

                this.items.forEach(item => {
                    const cartItem = document.createElement('li');
                    cartItem.className = 'cart-item d-flex align-items-center';
                    cartItem.innerHTML = `
                        <img src="${item.image}" alt="" class="cart-img w-25 h-25">
                        <div class="cart-item-info w-100">
                            <div class="cart-item-head" style="font-size: 14px; display: flex; justify-content: space-between; margin-right: 12px;">
                                <h5 class="cart-item-name">${item.name}</h5>
                                <div class="cart-item-price-wrap" style="font-weight: bold;">
                                    <span class="cart-item-price" style="color: #2a2a86;">${(parseFloat(item.price) || 0).toLocaleString()}đ</span>
                                    <span class="cart-item-multiply" style="color: #999; font-size: 10px; margin: 0 4px;">x</span>
                                    <span class="cart-item-quantity" style="color: #999; font-size: 13px;">${item.quantity}</span>
                                </div>
                            </div>
                            <div class="cart-item-body text-right mr-2">
                                <span class="cart-item-remove" data-name="${item.name}" data-image="${item.image}">Xóa</span>
                            </div>
                        </div>
                    `;
                    cartList.appendChild(cartItem);
                });
            }

            document.getElementById('checkout_items').textContent = this.items.reduce((total, item) => total + item.quantity, 0);
        }
    };

    cart.updateCartDisplay();

    document.querySelectorAll('.add_to_cart_button').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const productElement = this.closest('.product-item')||this.closest('.product_details');
            const product = {
                name: productElement.querySelector('.product_name').textContent,
                price: productElement.querySelector('.product_price').textContent.replace('đ', '').replace(/\,/g, '').trim(),
                image: productElement.querySelector('.product_image img').src
            };
            cart.addItem(product);
        });
    });

    document.querySelector('.cart-list-item').addEventListener('click', function(event) {
        if (event.target.classList.contains('cart-item-remove')) {
            const productName = event.target.getAttribute('data-name');
            const productImage = event.target.getAttribute('data-image');
            cart.removeItem(productName, productImage);
        }
    });

    // Thêm sự kiện click cho nút "Xem giỏ hàng"
    document.getElementById('viewCartBtn').addEventListener('click', function() {
        window.location.href = 'viewcart.html';
    });

    // Add event listener for product links in catalogue
    document.querySelectorAll('.product-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const productId = this.getAttribute('data-id');
            window.location.href = `single.html?id=${productId}`;
        });
    });

    // Check if we're on the single product page
    if (window.location.pathname.includes('single.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        const productData = getProductData(productId);
        
        if (productData) {
            document.getElementById('product_name').textContent = productData.name;
            document.getElementById('product_description').textContent = productData.description;
            document.getElementById('product_price').textContent = productData.price;
            document.getElementById('product_image').style.backgroundImage = `url(${productData.image})`;
            document.getElementById('product_thumbnail').src = productData.image;
            document.getElementById('product_thumbnail').setAttribute('data-image', productData.image);
        }

        const quantitySelector = document.querySelector('.quantity_selector');
        const addToCartButton = document.querySelector('.add_to_cart_button');

        quantitySelector.addEventListener('click', function(event) {
            const quantityValue = document.getElementById('quantity_value');
            let quantity = parseInt(quantityValue.textContent);

            if (event.target.classList.contains('plus')) {
                quantity++;
            } else if (event.target.classList.contains('minus') && quantity > 1) {
                quantity--;
            }

            quantityValue.textContent = quantity;
        });

        addToCartButton.addEventListener('click', function(event) {
            event.preventDefault();
            const quantity = parseInt(document.getElementById('quantity_value').textContent);
            cart.addItem({
                name: productData.name,
                price: productData.price,
                image: productData.image
            }, quantity);
        });
    }
});

function getProductData(productId) {
    // Đây là một hàm mô phỏng. Trong ứng dụng thực tế, bạn sẽ lấy dữ liệu này từ server.
    const products = {
        1: {
            id: 1,
            name: "Áo Khoác Gió Thông Minh Nữ Trượt Nước",
            description: "Áo khoác gió thông minh, chống nước hiệu quả.",
            price: "599,000đ",
            image: "images/yody/y_product_1-crop.jpg"
        },
        2: {
            id: 2,
            name: "Áo Khoác Nam Gia Đình 3c Pro",
            description: "Áo khoác nam chất liệu cao cấp, phù hợp cho cả gia đình, giữ ấm hiệu quả.",
            price: "499,000đ",
            image: "images/yody/y_product_2-crop.jpg"
        },
        3: {
            id: 3,
            name: "Áo Khoác Kid Nhỏ Gia Đình 3c Pro",
            description: "Áo khoác trẻ em thiết kế đồng bộ với áo người lớn, giữ ấm và bảo vệ bé hiệu quả.",
            price: "399,000đ",
            image: "images/yody/y_product_3-crop.jpg"
        },
        4: {
            id: 4,
            name: "Áo Thu Đông Trẻ Em Giữ Nhiệt Cổ Tròn",
            description: "Áo thu đông trẻ em chất liệu giữ nhiệt, cổ tròn thoải mái, giúp bé ấm áp trong mùa lạnh.",
            price: "129,000đ",
            image: "images/yody/y_product_4-crop.jpg"
        },
        5: {
            id: 5,
            name: "Áo Thun Trẻ Em Giữ Nhiệt Bamboo",
            description: "Áo thun trẻ em làm từ sợi bamboo, mềm mại, thoáng khí và có khả năng giữ nhiệt tốt.",
            price: "149,000đ",
            image: "images/yody/y_product_5-crop.jpg"
        }
    };
    return products[productId];
}
