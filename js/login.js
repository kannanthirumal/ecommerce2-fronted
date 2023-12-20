const showSignupBtn = document.getElementById("showSignupBtn");
const showLoginBtn = document.getElementById("showLoginBtn");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const signupUsername = document.getElementById("signupUsername");
const signupPassword = document.getElementById("signupPassword");
const signupEmail = document.getElementById("signupEmail");

const authErrMsg = document.getElementById("authErrMsg");
const succErrMsg = document.getElementById("succErrMsg");
const authSpinner = document.getElementById("authSpinner");

function showSignup() {
  updateAuthErrorMsg("");
  updateSuccErrorMsg("");
  signupForm.classList.remove("d-none");
  loginForm.classList.add("d-none");
}

function showLogin() {
  updateAuthErrorMsg("");
  updateSuccErrorMsg("");
  signupForm.classList.add("d-none");
  loginForm.classList.remove("d-none");
}

const BASE_URL = "http://localhost:8080/ecomm/api/v1";

function createCart() {
  // const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  // console.log(userId, token, "inside cart");
  console.log(token, "inside cart");
  const headers = {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${token}`,
    "x-access-token": token,
  };
  fetch(BASE_URL + "/carts", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ userId }),
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("cartId", data.id);
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function loginFn() {
  if (loginUsername.value == "") {
    updateAuthErrorMsg("Username should not be empty");
  } else if (loginPassword.value == "") {
    updateAuthErrorMsg("Password should not be empty");
  } else {
    updateAuthErrorMsg("");
    toggleSpinner(true);
    const data = {
      username: loginUsername.value,
      password: loginPassword.value,
    };
    fetch(BASE_URL + "/auth/signin", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        toggleSpinner(false);
        console.log("Success:", data.accessToken);
        if (data.accessToken) {
          localStorage.setItem("username", data.username);
          localStorage.setItem("userId", data.id);
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("email", data.email);
          createCart();
        } else {
          updateAuthErrorMsg(data.message);
        }
      })
      .catch((error) => {
        toggleSpinner(false);
        updateAuthErrorMsg("An error occurred. Please try again later.");
        console.error("Error:", error);
      });
  }
}

function signupFn() {
  if (signupUsername.value == "") {
    updateAuthErrorMsg("Username should not be empty");
  } else if (signupPassword.value == "") {
    updateAuthErrorMsg("Password should not be empty");
  } else if (signupEmail.value == "") {
    updateAuthErrorMsg("Email should not be empty");
  } else {
    updateAuthErrorMsg("");
    updateSuccErrorMsg("");
    toggleSpinner(true);
    const data = {
      username: signupUsername.value,
      password: signupPassword.value,
      email: signupEmail.value,
    };
    fetch(BASE_URL + "/auth/signup", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log('Success:', data);
        // localStorage.setItem("username", data.username)
        // localStorage.setItem("userId", data.id);
        // localStorage.setItem("email", data.email);
        // localStorage.setItem("token", data.accessToken);
        // createCart();
        // window.location.href = "index.html";
        toggleSpinner(false);
        updateSuccErrorMsg(data.message);
      })
      .catch((error) => {
        toggleSpinner(false);
        updateAuthErrorMsg("An error occurred. Please try again later.");
        console.error("Error:", error);
      });
  }
}

function updateAuthErrorMsg(msg) {
  authErrMsg.innerText = msg;
}
function updateSuccErrorMsg(msg) {
  succErrMsg.innerText = msg;
}

function toggleSpinner(show) {
  if (show) {
    authSpinner.classList.remove("d-none");
  } else {
    authSpinner.classList.add("d-none");
  }
}

function redirectToHome() {
  window.location.href = "/";
}

showSignupBtn.addEventListener("click", showSignup);
showLoginBtn.addEventListener("click", showLogin);
signupBtn.addEventListener("click", signupFn);
loginBtn.addEventListener("click", loginFn);

if (localStorage.getItem("username")) {
  window.location.href = "index.html";
}
