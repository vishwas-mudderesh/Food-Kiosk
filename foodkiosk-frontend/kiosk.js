// Sample menu data
const menuItems = [
    { id: 1, name: "Cheeseburger", price: 120, img: "https://t4.ftcdn.net/jpg/05/42/03/95/360_F_542039547_HWxq6bCIDHoH5BiQNyPwC2Kp4NBQL2qL.jpg" },
    { id: 2, name: "Veg Burger", price: 100, img: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/4/19/d4387d28-73ab-45b7-b424-61588863d158_9477217d-7c7a-4834-919a-b9ae7d7cf950.jpg" },
    { id: 3, name: "Chiken Burger", price: 140, img: "https://media.istockphoto.com/id/511520568/photo/fried-chicken-sandwich.jpg?s=612x612&w=0&k=20&c=tpgmjNZeBPVuJwtweGbgwHmr7_0gC0QMV5Ik45whiPk=" },
    { id: 4, name: "paneer wrap", price: 160, img: "https://img.freepik.com/premium-photo/vibrant-paneer-tikka-wrap-white-background-paneer-tikka-image-photography_1020697-118382.jpg" },
    { id: 5, name: "French Fries", price: 80, img: "https://img.freepik.com/premium-photo/french-fries-white-background_269543-544.jpg" },
    { id: 6, name: "Coke", price: 60, img: "https://images-cdn.ubuy.co.in/688b71c8d0c180764f0569a6-coca-cola-cane-sugar-mexican-soda-pop.jpg" }
];

let cart ={};

// Load menu items
const menuGrid = document.getElementById("menuGrid");
menuItems.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("menu-item");
    div.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <p>${item.name} = ₹${item.price}</p>
        <div class="add-items">
        <div class="sub">&#8722;</div>
          <div class="count">0</div>
          <div class="add">+</div>
        </div>
    `;
    let sub = div.querySelector(".sub")
    let count = div.querySelector(".count")
    let add = div.querySelector(".add")
    
    cart[item.id]={...item,quantity:0}

    sub.addEventListener("click",()=>{
        cart[item.id].quantity =  cart[item.id].quantity > 0? cart[item.id].quantity-1: cart[item.id].quantity ;
        count.textContent = cart[item.id].quantity;
        updateCart();
    })
    add.addEventListener("click",()=>{
        cart[item.id].quantity++;
        count.textContent = cart[item.id].quantity;
        updateCart();
    })
    menuGrid.appendChild(div);
});

function updateCart() {
    const cartItemsDiv = document.getElementById("cartItems");
    const orderr = document.querySelector(".order-slip")
    cartItemsDiv.innerHTML = " ";
    let total = 0;
    Object.values(cart).forEach(c => {
        if(c.quantity > 0){
        total+= c.price * c.quantity ;
        cartItemsDiv.innerHTML += `<p>${c.name} - ₹${c.price} x ${c.quantity}</p>`;
}});

    document.getElementById("cartTotal").innerHTML = `<b>Total: ₹${total}</b>`;
}





// Handle checkout: send cart to Django, receive order_number, go to next.html
const checkoutBtn = document.getElementById("checkoutBtn");
checkoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const items = Object.values(cart)
    .filter(c => c.quantity > 0)
    .map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));

  if (!items.length) {
    alert("Please add items to your cart.");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/api/orders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to place order");
    }

    const data = await res.json();
    // store and redirect
    sessionStorage.setItem("order_number", data.order_number);
    window.location.href = `next.html?order=${encodeURIComponent(data.order_number)}`;
  } catch (err) {
    console.error(err);
    alert("Could not place order. Please try again.");
  }
});



