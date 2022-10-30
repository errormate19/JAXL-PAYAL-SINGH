const GLOBALS = { sessionActive: false, email: false, otp: false };
const regex = { email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, otp: /[0-9]{6}/ };
const email = document.getElementById("email");

const validUser = async () => {
  const res = await fetch("http://localhost:5000/valid-user", {
    credentials: true,
  });
  const { user } = await res.json();
  return user;
};

setInterval(async () => {
  try {
    const user = await validUser();
    if (user) GLOBALS.sessionActive = true;
    else GLOBALS.sessionActive = false;
  } catch (e) {}
}, 500);

// const emailVerification = email
const OTPForm = document.getElementById("showOTPForm");

const requestOTP = (document.getElementById("requestOTP").onclick =
  async function (e) {
    if (!GLOBALS.sessionActive && !GLOBALS.email) {
      try {
        e.target.setAttribute("disabled", "true");
        const callAPI = fetch("http://localhost:5000/genrate-otp", {
          method: "POST",
          body: JSON.stringify({ email: email.value }),
          headers: { "Content-type": "application/json" },
        })
          .then((res) => {
            if (res.ok) return res.json();
            e.target.removeAttribute("disabled");
            throw new Error("cannot request otp");
          })
          .then((result) => {
            const { newUSER, res, error } = result;
            console.log(newUSER, res, error);
            if (!error) {
              OTPForm.classList.remove("hide");
              setTimeout(() => {
                e.target.removeAttribute("disabled");
              }, 30000);
            } else e.target.removeAttribute("disabled");
          })
          .catch((e) => {
            console.log(e);
          });
      } catch (e) {
        console.log("errror");
      }
    }
  });

document.getElementById("form").onsubmit = async function (e) {
  if (!GLOBALS.sessionActive && !GLOBALS.email && !GLOBALS.otp) {
    try {
      e.target.verifyOTP.setAttribute("disabled", "true");
      const callAPI = fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email: email.value, otp: otp.value }),
        headers: { "Content-type": "application/json" },
      })
        .then((res) => {
          if (res.ok) return res.json();
          e.target.removeAttribute("disabled");
          throw new Error("cannot request otp");
        })
        .then((result) => {
          const { newUSER, res, error } = result;
          console.log(newUSER, res, error);
          if (!error) {
            OTPForm.classList.remove("hide");
            setTimeout(() => {
              e.target.removeAttribute("disabled");
            }, 30000);
          } else e.target.removeAttribute("disabled");
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log("errror");
    }
  }
};
// document.getElementById("requestOTP").onclick = async function (e) {
//   console.log();

//   if (!GLOBALS.sessionActive && !GLOBALS.email) {
//   }
// };
