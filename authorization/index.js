const form = document.getElementById("form");
const username = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const completedMessage = form.querySelector(".completedMessage");
const buttonLoader = form.querySelector(".puff");
const button = document.getElementById("submitBtn");

const sendRequest = async (username, password, confirmPassword) => {
  try {
    buttonLoader.classList.remove("puff-hide");
    const response = await mockFetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, confirmPassword }),
    });

    if (response.ok) {
      buttonLoader.classList.add("puff-hide");
      const data = await response.json();
      completedMessage.innerHTML = data.token;
    } else {
      buttonLoader.classList.add("puff-hide");
      const errorData = await response.json();
      completedMessage.innerHTML = errorData.token;
    }
  } catch (error) {
    buttonLoader.classList.add("puff-hide");
    console.error("Введите правильные данные");
    completedMessage.innerHTML = "Введите данные снова!";
  }
};
////////////////////////////////

const mockFetch = (url, options) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url === "/api/auth/login" && options.method === "POST") {
        const { username, password, confirmPassword } = JSON.parse(
          options.body
        );
        if (
          username === "user" &&
          password === "password" &&
          confirmPassword === password
        ) {
          resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                token: "Вы " + username + " аутентификация пройдена",
              }),
          });
        } else {
          reject({
            ok: false,
            json: () => Promise.resolve({ error: "Неверные учетные данные" }),
          });
        }
      } else {
        reject({
          ok: false,
          json: () => Promise.resolve({ error: "Неверный URL или метод" }),
        });
      }
    }, 1000);
  });
};

////////////////////////////////

form.addEventListener("submit", (e) => {
  e.preventDefault();

  validateInputs();
  sendRequest(username.value, password.value, confirmPassword.value);
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

const validateInputs = () => {
  const usernameValue = username.value.trim();
  const passwordValue = password.value.trim();
  const confirmPasswordValue = confirmPassword.value.trim();

  if (usernameValue === "") {
    setError(username, "Username is required");
  } else {
    setSuccess(username);
  }

  if (passwordValue === "") {
    setError(password, "Password is required");
  } else if (password.length < 8) {
    setError(password, "Password must be at least 8 characters long");
  } else {
    setSuccess(password);
  }

  if (confirmPasswordValue === "") {
    setError(confirmPassword, "Confirm password is required");
  } else if (passwordValue !== confirmPasswordValue) {
    setError(confirmPassword, "Passwords do not match");
  } else {
    setSuccess(confirmPassword);
  }
};
