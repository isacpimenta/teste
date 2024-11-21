const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const inputAddress = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const deliveryOption = document.getElementById("delivery-option");
const pickupOption = document.getElementById("pickup-option");
const deliveryAddressSection = document.getElementById("delivery-address-section");
const pickupAddressSection = document.getElementById("pickup-address-section");

let cart = [];

// ABRIR O CARRINHO
cartBtn.addEventListener("click", function() {
    cartModal.style.display = 'flex';
    updateCartModal();
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = 'none';
})

// FECHAR O CARRINHO QUANDO CLICAR FORA
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal){
        cartModal.style.display = 'none';
    }
})

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    
    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        addToCart(name, price);
    }
})

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if (existingItem){
        existingItem.qtd += 1;
    }
    else {
        cart.push({
            name,
            price,
            qtd: 1,
        })
    }

    updateCartModal()
}

function updateCartModal() {
    cartItemsContainer.innerHTML = ""; // Limpa o conteúdo do contêiner
    let total = 0; // Inicializa o total

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between px-2 border-2 border-collapse border-black/60">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.qtd}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="text-red-500 remove-from-cart-btn" data-name="${item.name}">
                    REMOVER
                </button>
            </div>
        `;

        total += item.price * item.qtd;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
        
    cartCounter.innerHTML = cart.length;
    
}


cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.qtd > 1){
            item.qtd -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

// Ouvir mudanças nas opções de entrega
deliveryOption.addEventListener("change", function() {
    deliveryAddressSection.classList.remove("hidden");
    pickupAddressSection.classList.add("hidden");
});

pickupOption.addEventListener("change", function() {
    deliveryAddressSection.classList.add("hidden");
    pickupAddressSection.classList.remove("hidden");
});

inputAddress.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        inputAddress.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click", function() {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "RESTAURANTE FECHADO",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "left",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
            onClick: function() {}
        }).showToast();
        return;
    }

    if (cart.length === 0) {
        Toastify({
            text: "Seu carrinho está vazio!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "left",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
            onClick: function() {}
        }).showToast();
        return;
    }

    // Verifica se um tipo de entrega foi selecionado
    if (!deliveryOption.checked && !pickupOption.checked) {
        Toastify({
            text: "Por favor, escolha um tipo de entrega.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "left",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
            onClick: function() {}
        }).showToast();
        return;
    }

    // Verifica se a opção de entrega foi selecionada
    if (deliveryOption.checked) {
        if (inputAddress.value === "") {
            addressWarn.classList.remove("hidden");
            inputAddress.classList.add("border-red-700");
            return;
        }
    } else {
        // Se a opção de retirada foi escolhida, verifica se uma sede foi selecionada
        const pickupLocation = document.getElementById("pickup-location");
        if (pickupLocation.value === "") {
            Toastify({
                text: "Por favor, escolha uma sede para retirada.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "left",
                stopOnFocus: true,
                style: {
                    background: "#ef4444",
                },
                onClick: function() {}
            }).showToast();
            return;
        }
        addressWarn.classList.add("hidden");
        inputAddress.classList.remove("border-red-700");
    }

    const cartItems = cart.map((item) => {
        return ` ${item.name} Quantidade: (${item.qtd}) Preço: R$ ${item.price.toFixed(2)} |`;
    }).join("");

    const message = encodeURIComponent(cartItems + ` Endereço: ${inputAddress.value}`);
    const phone = "5521966630496";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    updateCartModal();

    console.log(cartItems);
});

function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}
else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}