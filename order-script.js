const product = [
    {
        id: 0,
        image: 'chickensiomai.jpg',
        title: 'Chicken Siomai',
        price: 10,
    },
    {
        id: 1,
        image: 'javarice.jpg',
        title: 'Java Rice',
        price: 13,
    },
    {
        id: 2,
        image: 'egg.jpg',
        title: 'Fried Egg',
        price: 5,
    },
    {
        id: 3,
        image: 'hotdog.jpg',
        title: 'Fried Hotdog',
        price: 10,
    }
];
const categories = [...new Set(product.map((item) =>
    {return item}))]
let i = 0;
document.getElementById('root').innerHTML = categories.map((item) =>
{
    var {image, title, price} = item;
    return(
        `<div class='box'>
            <div class='img-box'>
                <img class='images' src=${image}></img>
            </div>
        <div class='bottom'>
        <h3>${title}</h3>
        <h2>₱ ${price}.00</h2>`+
        "<button onclick='addtocart("+(i++)+")'>Add to cart</button>"+
        `</div>
        </div>`
    )
}).join('')

var cart =[];

function addtocart(a){
    cart.push({...categories[a]});
    displaycart();
}
function delElement(a){
    cart.splice(a, 1);
    displaycart();
}

function displaycart(){
    let j = 0, total=0;
    document.getElementById("count").innerHTML=cart.length;
    if(cart.length==0){
        document.getElementById('cartItem').innerHTML = "Your cart is empty";
        document.getElementById("total").innerHTML = "₱ "+0+".00";
    }
    else{
        document.getElementById("cartItem").innerHTML = cart.map((items)=>
        {
            var {image, title, price} = items;
            total=total+price;
            document.getElementById("total").innerHTML = "₱ "+total+".00";
            return(
                `<div class='cart-item'>
                <div class='row-img'>
                    <img class='rowimg' src=${image}>
                </div>
                <p style='font-size:12px;'>${title}</p>
                <h2 style='font-size: 15px;'>₱ ${price}.00</h2>`+
                "<i class='fa-solid fa-trash' onclick='delElement("+ (j++) +")'></i></div>"
            );
        }).join('');
    }

    
}

const form = document.querySelector('order-form');
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const subject = document.getElementById("subject");
const mess = document.getElementById("message");

function sendEmail(){
    let cartItems = '';
    for (const item of cart) {
        cartItems += `<li>${item.title} - ₱${item.price}.00</li>`;
    }

    const bodyMessage = `
        Full Name: ${fullName.value}<br>
        Email: ${email.value}<br>
        Phone: ${phone.value}<br>
        Address: ${mess.value}<br>
        <br>
        <h3>Cart Items:</h3>
        <ul>${cartItems}</ul>
    `;
    
    Email.send({
        SecureToken: "9b0ee278-28b0-4b76-b6af-3b3c7c85cf10",
        To : 'larrycabaelsoliva@gmail.com',
        From : "noobpopcorn@gmail.com",
        Subject : subject.value,
        Body : bodyMessage
    }).then(
        message => {
            if (message === "OK") {
                Swal.fire({
                    title: "Success!",
                    text: "Order Sent Successfully!",
                    icon: "success"
                });
            }
        }
    );
}

phone.addEventListener('input', function() {
    const maxChars = 11; 
    if (this.value.length > maxChars) {
      this.value = this.value.slice(0, maxChars); 
    }
  });

function checkInputs() {
    const items = document.querySelectorAll(".item");
    let allFieldsFilled = true;

    for (const item of items) {
        if (item.value === "") {
            item.classList.add("error");
            item.parentElement.classList.add("error");
            allFieldsFilled = false;
        } else {
            item.classList.remove("error");
            item.parentElement.classList.remove("error");
        }
    }

    if (!allFieldsFilled) {
        return false; 
    }

    checkEmail();
    return true; 
}

function checkEmail() {
    const emailRegex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/;

    if (!email.value.match(emailRegex)) {
        email.classList.add("error");
        email.parentElement.classList.add("error");
        return false; 
    } else {
        email.classList.remove("error");
        email.parentElement.classList.remove("error");
        return true; 
    }
}
let submissionCount = 0;
const submissionLimit = 3; 
const submissionInterval = 60000; 

function canSubmit() {
    const lastSubmission = localStorage.getItem('lastSubmission');
    if (!lastSubmission) {
        localStorage.setItem('lastSubmission', Date.now().toString());
        return true;
    } else {
        const elapsedTime = Date.now() - parseInt(lastSubmission);
        if (elapsedTime >= submissionInterval) {
            localStorage.setItem('lastSubmission', Date.now().toString());
            return true;
        } else {
            return false;
        }
    }
}
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('order-form');

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (canSubmit()) {
            if (checkInputs()) {
                if (checkEmail()) { 
                    sendEmail();
                    form.reset();
                    submissionCount++;
                    if (submissionCount >= submissionLimit) {
                        form.querySelector('button[type="submit"]').setAttribute('disabled', 'disabled');
                        
                        Swal.fire({
                            title: "Submission Limit Reached",
                            text: "You have reached the submission limit for this time frame. Please try again later.",
                            icon: "warning"
                        });
                    }
                } else {
                    Swal.fire({
                        title: "Invalid Email",
                        text: "Please enter a valid email address.",
                        icon: "error"
                    });
                }
            }
        } else {
            Swal.fire({
                title: "Submission Cooldown",
                text: "You have submitted too many times within a short period. Please try again later.",
                icon: "warning"
            });
        }
    });
});
