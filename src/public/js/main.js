const socket = io();

const button = document.querySelector("#button");

const deleteItem = (id, owner) => {

    if (rol !== "ADMIN") {
        if (owner !== userOwner) {
            Toastify({
                text: "No podes Eliminar este producto",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                style: {
                    background: "linear-gradient(to right, #353434, #000)",
                    color: "#ebce0f",
                },
            }).showToast();
        }
    }
    
    const data = id;
    console.log(owner)
    socket.emit("deleteProduct", data);

    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        style: {
            background: "linear-gradient(to right, #353434, #000)",
            color: "#ebce0f",
        },
    }).showToast();
};

function capitalize(text) {
    const firstLetter = text.charAt(0);
    const rest = text.slice(1);
    return firstLetter.toUpperCase() + rest;
}


button.addEventListener("click", (e) => {
    e.preventDefault();

    const form = document.getElementById("addProductForm");

    const title = document.querySelector("#title");
    const category = document.querySelector("#category");
    const description = document.querySelector("#description");
    const price = document.querySelector("#price");
    const code = document.querySelector("#code");
    const stock = document.querySelector("#stock");
    const img = document.querySelector("#img");

    const newProduct = {
        title: capitalize(title.value),
        category: category.value.toUpperCase(),
        description: capitalize(description.value),
        price: Number(price.value).toFixed(2),
        code: code.value.toUpperCase(),
        stock: Number(stock.value),
        owner: userOwner,
        img: img.value == '' ? "sinImg.png" : "productos/" + document.getElementById("img").files[0].name
    };
    socket.emit("addForForm", newProduct);

    form.reset();

});

socket.on("resultado", (data) => {
    console.log(data);
    Toastify({
        text: data,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #353434, #000)",
            color: "#ebce0f",
        },
    }).showToast();
});

function update (code) {
    document.getElementById("item"+code).classList.add("noVisible");
    document.getElementById("item"+code).classList.remove("rtCard");
    document.getElementById("update"+code).classList.remove("noVisible");
    document.getElementById("update"+code).classList.add("rtCard");
}

function noUpdate (code) {
    document.getElementById("item"+code).classList.remove("noVisible");
    document.getElementById("item"+code).classList.add("rtCard");
    document.getElementById("update"+code).classList.add("noVisible");
    document.getElementById("update"+code).classList.remove("rtCard");
}

function updateButton (code, id, owner) {

    if (rol !== "ADMIN") {
        if (owner !== userOwner) {
            Toastify({
                text: "No podes Actualizar este producto",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                style: {
                    background: "linear-gradient(to right, #353434, #000)",
                    color: "#ebce0f",
                },
            }).showToast();
        }
    }

    const stockUp = document.getElementById("stockUpdate"+code).value;
    const priceUp = document.getElementById("priceUpdate"+code).value;
    const data = {
        id: id,
        stock: !stockUp ? "" : stockUp,
        price: !priceUp ? "" : Number(priceUp)
    }

    socket.emit("updateProduct", data);

    document.getElementById("buttons"+code).classList.remove("rtButtons");
    document.getElementById("buttons"+code).classList.add("noVisible");
    document.getElementById("loading"+code).classList.remove("noVisible");
    document.getElementById("loading"+code).classList.add("load");

}

socket.on("listProduct", (data) => {
    const logProduct = document.querySelector("#listProducts");

    let listProducts = "";

    let products = data;

    if (rol !== "ADMIN") {
        products = [];

        for (prod of data) {
            prod.owner === userOwner ? products.push(prod): "";
        }
    }

    const sinStock = [];
    const stockBajo = [];
    const conStock = [];

    for (prod of products) {
        if (prod.stock == 0) {
            sinStock.push(prod);
        } else if (prod.stock > 0 && prod.stock < 10) {
            stockBajo.push(prod);
        } else {
            conStock.push(prod);
        }
    }

    sinStock.forEach((element) => {
        listProducts += `<div id="item${element.code}" class="rtCard sinstock">
                            <div class="rtFlex">
                                <div class="rtImgBox">
                                    <img class="rtImg" src="img/${element.img}">
                                </div>
                                <div class="rtInfo">
                                    <div class="rtCardInfo1">
                                        <h3>${element.title}</h3>
                                        <div>
                                            <h5>Categoria: ${element.category}</h5>
                                            <p>${element.description}</p>
                                        </div>
                                    </div>
                                    <div class="rtCardInfo2">
                                        <p>Codigo: ${element.code}  -  Stock: ${element.stock}</p>
                                        <h5>$ ${element.price.toFixed(2)}.-</h5>
                                    </div>
                                </div>
                            </div>
                            <div class="rtButtons">
                                <button class="rtBtn rtBtnUpdate" onClick="update('${element.code}')">Modificar</button>
                                <button class="rtBtn rtBtnDelete" onClick="deleteItem('${element._id}', '${element.owner}')">Borrar</button>
                            </div>
                        </div>


                        <div id="update${element.code}" class="noVisible">

                            <div class="rtFlex">
                                <div class="rtImgBox">
                                    <img class="rtImg" src="img/${element.img}">
                                </div>
                                <div class="rtInfo">
                                    <div class="rtCardInfo1">
                                        <div>
                                            <h3>${element.title}</h3>
                                            <p>Codigo: ${element.code}</p>
                                        </div>
                                        <div>
                                            <h5>Categoria: ${element.category}</h5>
                                            <p>${element.description}</p>
                                        </div>
                                    </div>
                                    <div class="rtCardInfo2">
                                        <p>Stock: <input class="rtFormItem" type="number" placeholder="${element.stock}" name="stockUpdate${element.code}" id="stockUpdate${element.code}"></p>
                                        <h5>Precio $ <input class="rtFormItem" type="number" placeholder="${element.price.toFixed(2)}" name="priceUpdate${element.code}" id="priceUpdate${element.code}"></h5>
                                    </div>
                                </div>
                            </div>
                            <div class="rtButtons" id="buttons${element.code}">
                                <button class="rtBtn rtBtnCancel" onClick="noUpdate('${element.code}')">Cancelar</button>
                                <button class="rtBtn rtBtnUpdate" onClick="updateButton('${element.code}', '${element._id}', '${element.owner}')">Actualizar</button>
                            </div>
                            <div class="noVisible" id="loading${element.code}">
                                <p>ACTUALIZANDO...</p>
                                <p>Enviando Notificaciones</p>
                                <P>Por favor, espere</p>
                            </div>
                        </div>
                        
                        `;
    });

    stockBajo.forEach((element) => {
        listProducts += `<div id="item${element.code}" class="rtCard stockbajo">
                            <div class="rtFlex">
                                <div class="rtImgBox">
                                    <img class="rtImg" src="img/${element.img}">
                                </div>
                                <div class="rtInfo">
                                    <div class="rtCardInfo1">
                                        <h3>${element.title}</h3>
                                        <div>
                                            <h5>Categoria: ${element.category}</h5>
                                            <p>${element.description}</p>
                                        </div>
                                    </div>
                                    <div class="rtCardInfo2">
                                        <p>Codigo: ${element.code}  -  Stock: ${element.stock}</p>
                                        <h5>$ ${element.price.toFixed(2)}.-</h5>
                                    </div>
                                </div>
                            </div>
                            <div class="rtButtons">
                                <button class="rtBtn rtBtnUpdate" onClick="update('${element.code}')">Modificar</button>
                                <button class="rtBtn rtBtnDelete" onClick="deleteItem('${element._id}', '${element.owner}')">Borrar</button>
                            </div>
                        </div>


                        <div id="update${element.code}" class="noVisible">

                            <div class="rtFlex">
                                <div class="rtImgBox">
                                    <img class="rtImg" src="img/${element.img}">
                                </div>
                                <div class="rtInfo">
                                    <div class="rtCardInfo1">
                                        <div>
                                            <h3>${element.title}</h3>
                                            <p>Codigo: ${element.code}</p>
                                        </div>
                                        <div>
                                            <h5>Categoria: ${element.category}</h5>
                                            <p>${element.description}</p>
                                        </div>
                                    </div>
                                    <div class="rtCardInfo2">
                                        <p>Stock: <input class="rtFormItem" type="number" placeholder="${element.stock}" name="stockUpdate${element.code}" id="stockUpdate${element.code}"></p>
                                        <h5>Precio $ <input class="rtFormItem" type="number" placeholder="${element.price.toFixed(2)}" name="priceUpdate${element.code}" id="priceUpdate${element.code}"></h5>
                                    </div>
                                </div>
                            </div>
                            <div class="rtButtons">
                                <button class="rtBtn rtBtnCancel" onClick="noUpdate('${element.code}')">Cancelar</button>
                                <button class="rtBtn rtBtnUpdate" onClick="updateButton('${element.code}', '${element._id}', '${element.owner}')">Actualizar</button>
                            </div>
                        </div>
                        
                        `;
    });

    conStock.forEach((element) => {
        listProducts += `<div id="item${element.code}" class="rtCard constock">
                            <div class="rtFlex">
                                <div class="rtImgBox">
                                    <img class="rtImg" src="img/${element.img}">
                                </div>
                                <div class="rtInfo">
                                    <div class="rtCardInfo1">
                                        <h3>${element.title}</h3>
                                        <div>
                                            <h5>Categoria: ${element.category}</h5>
                                            <p>${element.description}</p>
                                        </div>
                                    </div>
                                    <div class="rtCardInfo2">
                                        <p>Codigo: ${element.code}  -  Stock: ${element.stock}</p>
                                        <h5>$ ${element.price.toFixed(2)}.-</h5>
                                    </div>
                                </div>
                            </div>
                            <div class="rtButtons">
                                <button class="rtBtn rtBtnUpdate" onClick="update('${element.code}')">Modificar</button>
                                <button class="rtBtn rtBtnDelete" onClick="deleteItem('${element._id}', '${element.owner}')">Borrar</button>
                            </div>
                        </div>


                        <div id="update${element.code}" class="noVisible">

                            <div class="rtFlex">
                                <div class="rtImgBox">
                                    <img class="rtImg" src="img/${element.img}">
                                </div>
                                <div class="rtInfo">
                                    <div class="rtCardInfo1">
                                        <div>
                                            <h3>${element.title}</h3>
                                            <p>Codigo: ${element.code}</p>
                                        </div>
                                        <div>
                                            <h5>Categoria: ${element.category}</h5>
                                            <p>${element.description}</p>
                                        </div>
                                    </div>
                                    <div class="rtCardInfo2">
                                        <p>Stock: <input class="rtFormItem" type="number" placeholder="${element.stock}" name="stockUpdate${element.code}" id="stockUpdate${element.code}"></p>
                                        <h5>Precio $ <input class="rtFormItem" type="number" placeholder="${element.price.toFixed(2)}" name="priceUpdate${element.code}" id="priceUpdate${element.code}"></h5>
                                    </div>
                                </div>
                            </div>
                            <div class="rtButtons">
                                <button class="rtBtn rtBtnCancel" onClick="noUpdate('${element.code}')">Cancelar</button>
                                <button class="rtBtn rtBtnUpdate" onClick="updateButton('${element.code}', '${element._id}', '${element.owner}')">Actualizar</button>
                            </div>
                        </div>
                        
                        `;
    });

    logProduct.innerHTML = listProducts;
});
