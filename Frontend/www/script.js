let orderedList = [];

for(let i=0; i<localStorage.length; i++){
    const pizza = JSON.parse(localStorage.getItem(localStorage.key(i)));
    pizza["index"] = +localStorage.key(i);
    orderedList.push(pizza);
}

orderedList.sort((a,b) => a.index - b.index).forEach((pizza) => addToOrderList(pizza));

let totalPrice = 0;
for(const pizza of orderedList){
    totalPrice+=(+pizza.count)*(+pizza.price);
}
document.querySelector(".sum").textContent = totalPrice + "грн";
document.querySelector(".order-label h4 span").textContent = orderedList.length;


for(const pizza of pizza_info){
    createPizza(pizza);
}

let clickedButton = document.querySelectorAll(".nav button")[0];

function createPizza(pizza){
    const pizzaWrapper = document.createElement("div");
    pizzaWrapper.classList.add("pizza");
    if(pizza.is_new && pizza.is_popular){
        pizzaWrapper.classList.add("new");
    }else if(pizza.is_popular){
        pizzaWrapper.classList.add("popular");
    }
    const pizzaImage = document.createElement("img");
    pizzaImage.setAttribute("src", pizza.icon);
    pizzaWrapper.appendChild(pizzaImage);
    const pizzaCaption = document.createElement("div");
    pizzaCaption.classList.add("pizza-caption");
    pizzaWrapper.appendChild(pizzaCaption);
    const pizzaLabel = document.createElement("h3");
    pizzaLabel.textContent = pizza.title;
    pizzaCaption.appendChild(pizzaLabel);
    const pizzaType = document.createElement("span");
    pizzaType.classList.add("pizza-type");
    pizzaType.textContent = pizza.type;
    pizzaCaption.appendChild(pizzaType);
    const pizzaDescription = document.createElement("p");
    let description = [];
    for(const product in pizza.content){
        description = description.concat(pizza.content[product]);
    }
    let content = description.join(", ");
    content = content.charAt(0).toUpperCase() + content.slice(1);
    pizzaDescription.textContent = content;
    pizzaCaption.appendChild(pizzaDescription);
    const pizzaData = document.createElement("section");
    pizzaData.classList.add("pizza-data");
    pizzaCaption.appendChild(pizzaData);
    if("small_size" in pizza){
        const smallPizza = document.createElement("section");
        smallPizza.classList.add("small-pizza");
        pizzaData.appendChild(smallPizza);
        const smallSize = document.createElement("span");
        smallPizza.appendChild(smallSize);
        const sizeImage = document.createElement("img");
        sizeImage.setAttribute("src", "assets/images/size-icon.svg");
        smallSize.appendChild(sizeImage);
        const sizeText = document.createTextNode(pizza.small_size.size);
        smallSize.appendChild(sizeText);
        const smallWeight = document.createElement("span");
        smallPizza.appendChild(smallWeight);
        const weightImage = document.createElement("img");
        weightImage.setAttribute("src", "assets/images/weight.svg");
        smallWeight.appendChild(weightImage);
        const weightText = document.createTextNode(pizza.small_size.weight)
        smallWeight.appendChild(weightText);
        const price = document.createElement("h2");
        price.textContent = pizza.small_size.price;
        smallPizza.appendChild(price);
        const currency = document.createElement("span");
        currency.classList.add("price");
        currency.textContent = "грн.";
        smallPizza.appendChild(currency);
        const buyButton = document.createElement("button");
        buyButton.textContent = "Купити";
        buyButton.classList.add("small");
        buyButton.addEventListener("click", () => buyPizza(buyButton));
        smallPizza.appendChild(buyButton);
    }
    if("big_size" in pizza){
        const bigPizza = document.createElement("section");
        bigPizza.classList.add("big-pizza");
        pizzaData.appendChild(bigPizza);
        const bigSize = document.createElement("span");
        bigPizza.appendChild(bigSize);
        const sizeImage = document.createElement("img");
        sizeImage.setAttribute("src", "assets/images/size-icon.svg");
        bigSize.appendChild(sizeImage);
        const sizeText = document.createTextNode(pizza.big_size.size);
        bigSize.appendChild(sizeText);
        const bigWeight = document.createElement("span");
        bigPizza.appendChild(bigWeight);
        const weightImage = document.createElement("img");
        weightImage.setAttribute("src", "assets/images/weight.svg");
        bigWeight.appendChild(weightImage);
        const weightText = document.createTextNode(pizza.big_size.weight)
        bigWeight.appendChild(weightText);
        const price = document.createElement("h2");
        price.textContent = pizza.big_size.price;
        bigPizza.appendChild(price);
        const currency = document.createElement("span");
        currency.classList.add("price");
        currency.textContent = "грн.";
        bigPizza.appendChild(currency);
        const buyButton = document.createElement("button");
        buyButton.textContent = "Купити";
        buyButton.classList.add("big");
        buyButton.addEventListener("click", () => buyPizza(buyButton));
        bigPizza.appendChild(buyButton);
    }
    pizzaWrapper.setAttribute("id", pizza.id);
    const pizzaList = document.querySelector(".pizza-list");
    pizzaList.appendChild(pizzaWrapper);
}

const allButtons = document.querySelectorAll(".nav button");
for(const button of allButtons){
    button.addEventListener("click", () => filter(button, button.id));
}

const allPizzas = document.querySelectorAll(".pizza");

function filter(button, property){
    clickedButton.classList.remove("clicked");
    clickedButton = button;
    button.classList.add("clicked");
    let count = 0;
    for(const pizza of pizza_info){
        if(!(property in pizza.content)){
            document.getElementById(pizza.id).setAttribute("style", "display: none");
        }else{
            document.getElementById(pizza.id).removeAttribute("style");
            count++;
        }
    }
    if (property === "vega") {
        for (const pizza of pizza_info) {
            if (
                !("meat" in pizza.content) &&
                !("chicken" in pizza.content) &&
                !("ocean" in pizza.content)
            ) {
                document.getElementById(pizza.id).removeAttribute("style");
                count++;
            } else {
                document.getElementById(pizza.id).setAttribute("style", "display: none");
            }
        }
    }
    if(property === "all"){
        for(pizza of allPizzas){
            pizza.removeAttribute("style");
        }
        count = 8;
    }
    if(button.id == "all"){
        document.querySelector("header h2").childNodes[0].textContent = "Усі піци";
    }else{
        document.querySelector("header h2").childNodes[0].textContent = button.textContent;
    }
    document.querySelector("header h2").childNodes[1].textContent = count;

}

function buyPizza(button){
    const id = button.parentElement.parentElement.parentElement.parentElement.id;
    const size = button.classList[0];
    let price;
    for(pizza of pizza_info){
        if(id == pizza.id){
            if(size === "small"){
                price = pizza.small_size.price;
            }else{
                price = pizza.big_size.price;
            }
        }
    }
    let exist;
    for(const item of orderedList){
        if(item.id == id && item.size == size){
            addPizza(item);
            exist = true;
        }
    }
    if(!exist){
        let pizza = {
            id,
            size,
            price,
            count: 1,
        }
        orderedList.push(pizza);
        addToOrderList(pizza);
        let totalPrice = 0;
        for(const pizza of orderedList){
            totalPrice+=(+pizza.count)*(+pizza.price);
        }
        document.querySelector(".sum").textContent = totalPrice + "грн";
        document.querySelector(".order-label h4 span").textContent = orderedList.length;
    }
}


const clearButton = document.querySelector(".order-label button");
clearButton.addEventListener("click", function(){
    orderedList = [];
    const orderedPizzas = document.querySelectorAll(".ordered-pizza");
    for(const pizza of orderedPizzas){
        pizza.remove();
    }
    document.querySelector(".sum").textContent = "0грн";
    document.querySelector(".order-label h4 span").textContent = orderedList.length;
});


function addPizza(item){
    const pizza = document.querySelector("#"+item.size+item.id);
    pizza.querySelector(".amount").textContent = +pizza.querySelector(".amount").textContent+1;
    for(const pizza of orderedList){
        if(item.id == pizza.id){
            item.count = +item.count+1;
        }
    }
    let price = (+item.count)*(+item.price);
    pizza.querySelector(".ordered-price").textContent = price+"грн";
    let totalPrice = 0;
    for(const pizza of orderedList){
        totalPrice+=(+pizza.count)*(+pizza.price);
    }
    document.querySelector(".sum").textContent = totalPrice + "грн";
}


function reducePizza(item){
    const pizza = document.querySelector("#"+item.size+item.id);
    pizza.querySelector(".amount").textContent = +pizza.querySelector(".amount").textContent-1;
    for(const pizza of orderedList){
        if(item.id == pizza.id){
            item.count = +item.count-1;
        }
    }
    let price = (+item.count)*(+item.price);
    pizza.querySelector(".ordered-price").textContent = price+"грн";
    let totalPrice = 0;
    for(const pizza of orderedList){
        totalPrice+=(+pizza.count)*(+pizza.price);
    }
    document.querySelector(".sum").textContent = totalPrice + "грн";
    if(pizza.querySelector(".amount").textContent == 0){
        pizza.remove();
        orderedList.splice(orderedList.indexOf(item), 1);
        document.querySelector(".order-label h4 span").textContent = orderedList.length;
    }
}

function deletePizza(item){
    const pizza = document.querySelector("#"+item.size+item.id);
    pizza.remove();
    orderedList.splice(orderedList.indexOf(item), 1);
    let totalPrice = 0;
    for(const pizza of orderedList){
        totalPrice+=(+pizza.count)*(+pizza.price);
    }
    document.querySelector(".sum").textContent = totalPrice + "грн";
    document.querySelector(".order-label h4 span").textContent = orderedList.length;
}

function addToOrderList(pizza){
    let pizzaById;
    for(item of pizza_info){
        if(pizza.id == item.id){
            pizzaById = item;
        }
    }
    const pizzaWrapper = document.createElement("section");
    pizzaWrapper.id = pizza.size+pizza.id;
    pizzaWrapper.classList.add("ordered-pizza");
    document.querySelector(".ordered-list").appendChild(pizzaWrapper);
    const pizzaLabel = document.createElement("label");
    pizzaLabel.classList.add("ordered-label");
    pizzaLabel.textContent = pizzaById.title;
    pizzaWrapper.appendChild(pizzaLabel);
    const pizzaType = document.createElement("span");
    pizzaType.classList.add("ordered-type");
    const pizzaSize = document.createElement("section");
    pizzaSize.classList.add("ordered-size");
    pizzaWrapper.appendChild(pizzaSize);
    const sizeLabel = document.createElement("span");
    pizzaSize.appendChild(sizeLabel);
    const sizeImage = document.createElement("img");
    sizeImage.setAttribute("src", "assets/images/size-icon.svg");
    sizeLabel.appendChild(sizeImage);
    let sizeText;
    let weightText;
    if(pizza.size === "small"){
        pizzaType.textContent = "(Мала)";
        sizeText = document.createTextNode("30");
        weightText = document.createTextNode(pizzaById.small_size.weight);
    }else{
        pizzaType.textContent = "(Велика)";
        sizeText = document.createTextNode("40");
        weightText = document.createTextNode(pizzaById.big_size.weight);
    }
    pizzaLabel.appendChild(pizzaType);
    sizeLabel.appendChild(sizeText);
    const weightLabel = document.createElement("span");
    pizzaSize.appendChild(weightLabel);
    const weightImage = document.createElement("img");
    weightImage.setAttribute("src", "assets/images/weight.svg");
    weightLabel.appendChild(weightImage);
    weightLabel.appendChild(weightText);
    const pizzaCost = document.createElement("section");
    pizzaCost.classList.add("order-cost");
    pizzaWrapper.appendChild(pizzaCost);
    const pizzaPrice = document.createElement("span");
    pizzaPrice.classList.add("ordered-price");
    pizzaCost.appendChild(pizzaPrice);
    pizzaPrice.textContent = (pizza.price*pizza.count + "грн");
    const minusButton = document.createElement("button");
    minusButton.classList.add("minus");
    pizzaCost.appendChild(minusButton);
    minusButton.textContent = "-";
    minusButton.addEventListener("click", () => reducePizza(pizza));
    const pizzaAmount = document.createElement("span");
    pizzaAmount.classList.add("amount");
    pizzaAmount.textContent = pizza.count;
    pizzaCost.appendChild(pizzaAmount);
    const plusButton = document.createElement("button");
    plusButton.classList.add("plus");
    pizzaCost.appendChild(plusButton);
    plusButton.textContent = "+";
    plusButton.addEventListener("click", () => addPizza(pizza));
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("cross");
    pizzaCost.appendChild(deleteButton);
    deleteButton.addEventListener("click", () => deletePizza(pizza));
    deleteButton.textContent = "×";
    const pizzaImage = document.createElement("img");
    pizzaImage.classList.add("pizza-img");
    pizzaImage.setAttribute("src", pizzaById.icon);
    pizzaWrapper.appendChild(pizzaImage);   
}

window.onbeforeunload = function(){
    localStorage.clear();
    let counter = 0;
    for(const pizza of orderedList){
        localStorage.setItem(counter++, JSON.stringify(pizza));
    }
}
         








