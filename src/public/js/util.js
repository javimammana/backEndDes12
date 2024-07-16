
let flag = true;

function pass() {
    if(flag) {
        document.getElementById("loginPass").type = "password";
        document.getElementById("loginPass-ico").src = "/img/noVisible.png";
        flag = false;

    } else {
        document.getElementById("loginPass").type = "text";
        document.getElementById("loginPass-ico").src = "/img/visible.png";
        flag = true;
    }
}

let flag2 = true;
function pass2() {
    if(flag2) {
        document.getElementById("loginRePass").type = "password";
        document.getElementById("loginRePass-ico").src = "/img/noVisible.png";
        flag2 = false;

    } else {
        document.getElementById("loginRePass").type = "text";
        document.getElementById("loginRePass-ico").src = "/img/visible.png";
        flag2 = true;
    }
}

