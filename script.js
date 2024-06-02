//variables
const cartBtn = document.querySelector(".cart-btn");
const ClearCartBtn = document.querySelector(".btn-clear");
const cartItems = document.querySelectorAll(".cart-items");
const cartTotal = document.querySelectorAll(".cart-value");
const cartContent = document.querySelectorAll(".cart-list");
const productsDOM = document.querySelector("#products-dom")


let cart = [];
let buttonsDOM = [];

class Products  {
    async getProducts() {
        try{
            let result = await fetch("https://665c644e3e4ac90a04d96c96.mockapi.io/products");
            let data = await result.json();
            let products = data;
            return products;
        }catch (error){
            console.log(error);
        }
    }
};

class UI{
    displayProducts(products) {
        let result = "";
        products.forEach(item =>{
            result += `
            <div class="col-lg-4 col-md-6">
                <div class="product">
                    <div class="product-image">
                        <img src=${item.image} alt="product">
                    </div>
                    <div class="product-hover">
                        <span class="product-title">${item.title}</span>
                        <span class="product-price">${item.price}</span>
                        <button class="btn-add-to-cart" data-id = ${item.id}>
                            <i class="fas fa-cart-shopping"></i>
                        </button>
                    </div>
                </div>
            </div>
        `});
        productsDOM.innerHTML = result;
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".btn-add-to-cart")];
        buttonsDOM = buttons;
        buttonsDOM.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){
                button.setAttribute("disabled", "disabled");
                button.style.opacity =".3";
            }else{
                button.addEventListener("click",event => {
                    event.target.disabled = true;
                    event.target.style.opacity = ".3";
                    //* get products from products
                    let cartItem = {...Storage.getProduct(id), amount:1};
                    console.log(cartItem);
                    /// add product to cart
                    cart = [...cart,cartItem];
                    //*save cart in local storage
                    Storage.saveCart(cart);
                });
            }
        });

    }

}

class Storage{
    static SaveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    };
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(products => products.id === id);
    }
    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart));
    };
}



document.addEventListener("DOMContentLoaded", ()=>{
    const products = new Products();
    const ui = new UI();

    products.getProducts().then(products =>{
        ui.displayProducts(products);
        Storage.SaveProducts(products);
    }).then(()=>{
        ui.getBagButtons();
    })
});