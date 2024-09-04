const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const completedMessage = form.querySelector(".completedMessage");
const buttonLoader = form.querySelector('.puff');
const button = document.getElementById("submitBtn");

const sendRequest = async () => {
  try {
    buttonLoader.classList.remove('puff-hide');
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });
    

    if (!response.ok) {
      setTimeout(() => {
        completedMessage.innerHTML = "Регистрация завершена успешно!";
        buttonLoader.classList.add('puff-hide');
      }, 2000);
    } else {
      setTimeout(() => {
        alert("Ошибка регистрации. Проверьте введенные данные.");
      }, 2000);
    }
  } catch (error) {
    console.error("Ошибка:", error);
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  validateInputs();
  sendRequest();
});

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorMsg = inputControl.querySelector(".error");

  errorMsg.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorMsg = inputControl.querySelector(".error");

  errorMsg.innerText = "";
  inputControl.classList.remove("error");
  inputControl.classList.add("success");
};

const isValid = (element) => {
  const re =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
  return re.test(String(element.value).toLowerCase());
};

const validateInputs = () => {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const confirmPasswordValue = confirmPassword.value.trim();

  if (usernameValue === "") {
    setError(username, "Username is required");
  } else {
    setSuccess(username);
  }

  if (emailValue === "") {
    setError(email, "Email is required");
  } else if (!isValid(email)) {
    setError(email, "Invalid email format");
  } else {
    setSuccess(email);
  }

  if (passwordValue === "") {
    setError(password, "Password is required");
  } else if (password.length < 8) {
    setError(password, "Password must be at least 8 characters long");
  } else {
    setSuccess(password);
  }

  if (emailValue === "") {
    setError(confirmPassword, "Confirm password is required");
  } else if (passwordValue !== confirmPasswordValue) {
    setError(confirmPassword, "Passwords do not match");
  } else {
    setSuccess(confirmPassword);
  }
};
