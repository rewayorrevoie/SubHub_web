let users = JSON.parse(localStorage.getItem("users")) || [];

function register(){
    let name = document.getElementById("regName").value;
    let pass = document.getElementById("regPass").value;
    if(!name || !pass){ alert("Заполните все поля"); return; }
    if(users.find(u => u.name === name)){ alert("Пользователь существует"); return; }
    users.push({name, pass, subs: []});
    localStorage.setItem("users", JSON.stringify(users));
    alert("Аккаунт создан"); showLogin();
}

function login(){
    let name = document.getElementById("loginName").value;
    let pass = document.getElementById("loginPass").value;
    let user = users.find(u => u.name === name && u.pass === pass);
    if(!user){ alert("Неверные данные"); return; }
    localStorage.setItem("currentUser", name);
    window.location.href = "store.html";
}

function showRegister(){
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("registerBox").style.display = "block";
}
function showLogin(){
    document.getElementById("registerBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
}

function getCurrentUser(){
    let name = localStorage.getItem("currentUser");
    let users = JSON.parse(localStorage.getItem("users"));
    return users.find(u => u.name === name);
}

function saveUser(user){
    let users = JSON.parse(localStorage.getItem("users"));
    let i = users.findIndex(u => u.name === user.name);
    users[i] = user;
    localStorage.setItem("users", JSON.stringify(users));
}

function buy(service){
    if(!service) return;
    let user = getCurrentUser();
    if(user.subs.find(s => s.name === service)){
        alert("Подписка уже активна");
        return;
    }
    localStorage.setItem("pendingSub", service);

    let modal = document.getElementById("paymentModal");
    modal.style.display = "flex";
}

function closePayment(){
    let modal = document.getElementById("paymentModal");
    modal.style.display = "none";
}

function confirmPayment(){
    let service = localStorage.getItem("pendingSub");
    if(!service) return;
    let user = getCurrentUser();
    let accountLink = document.getElementById("accountLink").value || "Не указан";

    let date = new Date(); 
    date.setMonth(date.getMonth() + 1);

    user.subs.push({
        name: service,
        expires: date.toISOString().split("T")[0],
        link: accountLink
    });
    saveUser(user);

    let modal = document.getElementById("paymentModal");
    modal.querySelector("h2").innerText = "Подписка активирована!";

    setTimeout(() => {
        modal.style.display = "none";
        modal.style.background = "rgba(0,0,0,0.9)";
        modal.querySelector("h2").innerText = "Оплата подписки";
        document.getElementById("accountLink").value = "";
    }, 1200);

    alert(service + " активирована!");

    if(window.updateProfileList) updateProfileList();
}