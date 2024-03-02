let notifications = document.querySelector('.notifications');

const login = async () => {
    const firstName = document.getElementById("name").value
    const password = document.getElementById("password").value

    const user = {
        firstName: firstName,
        password: password,
    }

    const res = await fetch("http://localhost:4000/sign-up", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    })
    
}
let code = 0;

function createToast(type, icon, title, text) {
    let newToast = document.createElement('div');
    newToast.innerHTML = `
        <div class="toast success">
            <i class="fa-solid fa-circle-check"></i>
            <div class="content">
                <div class="title">Success</div>
                <span>This is a success toast</span>
            </div>
            <i class="fa-solid fa-xmark"></i>
        </div>`;
        console.log("sdzesr", notifications)
        if(notifications) notifications.appendChild(newToast);
        // newToast.timeOut = setTimeout(
        //     () => newToast.remove(), 5000000
        // )
}

function showToast(text) {
    var message = text;
    
    // Create a new toast element
    var toast = document.createElement('div');
    toast.id = 'toast';
    toast.textContent = message;

    // Append the toast to the body
    document.body.appendChild(toast);

    // Trigger reflow to enable transition
    void toast.offsetWidth;

    // Show the toast
    toast.style.opacity = 1;

    // Hide the toast after a certain duration (e.g., 3000 milliseconds or 3 seconds)
    setTimeout(function () {
        toast.style.opacity = 0;

        // Remove the toast from the DOM after fading out
        setTimeout(function () {
            document.body.removeChild(toast);
        }, 500);
    }, 3000);
}

async function signup_user() {

    console.log("sign up user")

    console.log("hi")
    const username = document.getElementById("username").value
    const useremail = document.getElementById("useremail").value
    const userpassword = document.getElementById("userpassword").value
    const userconfirmpassword = document.getElementById("userconfirmpassword").value
    const userbalance = document.getElementById("userbalance").value;

    localStorage.setItem("username", username)
    localStorage.setItem("useremail", useremail);
    localStorage.setItem("userpassword", userpassword);
    localStorage.setItem("userbalance", userbalance);
    


    if((username === "") || (useremail === "") || (userpassword === "") || (userconfirmpassword === "")) {
        alert("No field should be empty.Try Again")
        return;
    }

    if (userconfirmpassword !== userpassword) {
        showToast("Passwords Didn't Match.Try Again");
        const error = document.getElementById("error-msg")
        error.innerHTML = "<p>invaid</p>"
        return;
    }

    

        console.log("hello")
        
        code = Math.floor((Math.random()*1000000)+1);

        const newUser = {
            username: username,
            useremail: useremail,
            userpassword: userpassword,
            code: code
        }


        const res = await fetch("http://localhost:4000/usersendmail", {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
        })
        
        window.location.href = "../html/signup_usercode.html";
        
}



async function signup_agent() {

    console.log("sign up")

    // let type = 'success';
    // let icon = 'fa-solid fa-circle-check';
    // let title = 'Success';
    // let text = 'This is a success toast.';
    // createToast(type, icon, title, text);
    // showToast('hi');



    
    console.log("hi")
    const fname = document.getElementById("name").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirm-password").value


    if((fname === "") || (email === "") || (password === "") || (confirmPassword === "")) {
        alert("No field should be empty.Try Again")
        return;
    }

    if (confirmPassword !== password) {
        showToast("Passwords Didn't Match.Try Again");
        const error = document.getElementById("error-msg")
        error.innerHTML = "<p>invaid</p>"
        return;
    }

    

        console.log("hello")
        // newWindow = window.open("http://localhost:5501/code.html", "","width=500px,height=250px,left=450px,top=250px");

        code = Math.floor((Math.random()*1000000)+1);

        const newUser = {
            name: fname,
            email,
            password,
            code: code
        }

        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem("username", fname);

        const res = await fetch("http://localhost:4000/create_agent", {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
        })


        console.log("niche astese")
        
        window.location.href = "../html/code.html";
        
}



 async function check_code() {
    console.log("check code")
    const fname = localStorage.getItem("username")
    const email = localStorage.getItem("email")
    const password = localStorage.getItem("password")
    const account_type = localStorage.getItem("account_type");
    console.log(account_type);

    const code1 = document.getElementById("verification-code").value
    console.log("this is code"+code, code1)

    const newUser = {
        name: fname,
        email,
        password,
        account_type:account_type
    }

    
    const userCode = {
        email:email,
        code:code1
    }

    console.log(localStorage.getItem("email"))
   
    const res = await fetch("http://localhost:4000/verify", {
        method: "POST",
        body: JSON.stringify(userCode),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    })

    const response = await res.json();

    console.log(response)

    await fetch("http://localhost:4000/remove-code", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

    if(response === true) {
        // showToast('Login successful!');
        
        showToast('Sign Up successful!');
        
        await fetch("http://localhost:4000/login", {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        window.location.href = "http://127.0.0.1:5501/html/dashboard_agent.html";
    }
    else {
        showToast("Code Didn't Match.Try Again");
        return;
    }
}


async function signin() {
 
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    Email = email;
    const user = {
        email:email,
        password:password
    };

    const res = await fetch("http://localhost:4000/login-search", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    const response = await res.json();
    console.log(response);
    
    const balanceresult = await fetch("http://localhost:4000/balance", {
        method: "POST",
        body: JSON.stringify({email}),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    const balanceData = await balanceresult.json();

    // Store email and balance in localStorage/sessionStorage or pass as query params
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('userBalance', balanceData.balance);
     


    if (response === 1) {
        window.location.href = "http://127.0.0.1:5501/html/dashboard.html";
        showToast("Login Successful!");

        document.getElementById('userBalance').innerText = Balance;
        document.getElementById('userEmail').innerText = Email;
    } else if (response === 0) {
        showToast("Invalid Email and Password");
    } else {
        showToast("Email is not registered");
    } 
}





function account() {
    window.location.href = "../html/account-details.html";
}

async function updatePassword() {
    const email = document.getElementById("email").value
    const current_Pass = document.getElementById("currentPassword").value
    const new_pass = document.getElementById("newPassword").value
    const con_newPass = document.getElementById("confirmPassword").value

    const user = {
        email: email,
        curr_pass : current_Pass,
        password: new_pass
    }

    if(new_pass !== con_newPass) {
        showToast("New Passwords Don't Match!");
    }

    const res = await fetch("http://localhost:4000/pass-check", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    })

    const response2 = await res.json();
    console.log(response2);

    if(response2 === true) {
        console.log("entered in true")
        if(new_pass !== con_newPass) {
            showToast("New Passwords Don't Match!");
        }
        else {
            const res = await fetch("http://localhost:4000/update", {
                method: "POST",
                body: JSON.stringify(user),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            showToast("Password Updated");
            }
        }
    else {
        console.log("entered in false")
        showToast("Invalid Email or Password");
    }
}

async function delete_account() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const user = {
        email:email,
        curr_pass: password,
        password: password
    }

    const res = await fetch("http://localhost:4000/pass-check", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    })

    const response = await res.json();

    if(response === true) {
        const res = await fetch("http://localhost:4000/delete", {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
        })

        showToast("Account Deleted");
    }

    else {
        showToast("Invalid Email or Password");
    }
}

async function sendmoney() {  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const youremail = document.getElementById("email1").value;
    const amount = document.getElementById("amount1").value;
    const reference = document.getElementById("reference1").value;
    
    const user = { 
        email: email,
        password: password,
        amount: amount,
        youremail: youremail,
        reference:reference
    };
    
    const res = await fetch("http://localhost:4000/add", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    if (res.ok) {
        try {
            const response = await res.json();
            console.log(response.num);
            if (response.num === 1) { // Check the property "num" of the response
                showToast("Login Successful!");
                window.location.href = "http://127.0.0.1:5501/html/successful.html";
            } else {
                showToast("Send money unsuccessful");
            }
        } catch (error) {
            console.error("Error parsing JSON response:", error);
            showToast("Error: Unable to parse server response");
        }
    } else {
        console.error("Server error:", res.status, res.statusText);
        showToast("Error: Server error occurred");
    }

   
}


async function sendmoney_agent() {  
    const email = document.getElementById("email_agent").value;
    const password = document.getElementById("password_agent").value;
    const youremail = document.getElementById("email_agent_your").value;
    const amount = document.getElementById("amount_agent").value;
    const reference = document.getElementById("reference_agent").value;
    
    const user = { 
        email: email,
        password: password,
        amount: amount,
        youremail: youremail,
        reference:reference
    };
    
    const res = await fetch("http://localhost:4000/add_agent", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    if (res.ok) {
        try {
            const response = await res.json();
            console.log(response.num);
            if (response.num === 1) { // Check the property "num" of the response
                showToast("Login Successful!");
                window.location.href = "http://127.0.0.1:5501/html/successful_agent.html";
            } else {
                showToast("Send money unsuccessful");
            }
        } catch (error) {
            console.error("Error parsing JSON response:", error);
            showToast("Error: Unable to parse server response");
        }
    } else {
        console.error("Server error:", res.status, res.statusText);
        showToast("Error: Server error occurred");
    }

   
}


async function cashout() {  
    const agentemail = document.getElementById("agentmail").value;
    const password = document.getElementById("passwordcashout").value;
    const youremail = document.getElementById("cashout_sender").value;
    const amount = document.getElementById("amount_cashout").value;
    const reference = document.getElementById("reference_cashout").value;
    
    const user = { 
        agentemail: agentemail,
        password: password,
        amount: amount,
        youremail: youremail,
        reference:reference
    };
    
    const res = await fetch("http://localhost:4000/cashout", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    if (res.ok) {
        try {
            const response = await res.json();
            console.log(response.num);
            if (response.num === 1) { // Check the property "num" of the response
                showToast("Login Successful!");
                window.location.href = "http://127.0.0.1:5501/html/successful.html";
            } else {
                showToast("Send money unsuccessful");
            }
        } catch (error) {
            console.error("Error parsing JSON response:", error);
            showToast("Error: Unable to parse server response");
        }
    } else {
        console.error("Server error:", res.status, res.statusText);
        showToast("Error: Server error occurred");
    }

    
}




async function cashout_agent() {  
    const agentemail = document.getElementById("agentemail").value;
    const password = document.getElementById("passwordcashout").value;
    const youremail = document.getElementById("youremail").value;
    const amount = document.getElementById("amount_cashout").value;
    const reference = document.getElementById("reference").value;
    
    const user = { 
        agentemail: agentemail,
        password: password,
        amount: amount,
        youremail: youremail,
        reference:reference
    };
    
    const res = await fetch("http://localhost:4000/cashout_agent", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    if (res.ok) {
        try {
            const response = await res.json();
            console.log(response.num);
            if (response.num === 1) { // Check the property "num" of the response
                showToast("Login Successful!");
                window.location.href = "http://127.0.0.1:5501/html/successful_agent.html";
            } else {
                showToast("Send money unsuccessful");
            }
        } catch (error) {
            console.error("Error parsing JSON response:", error);
            showToast("Error: Unable to parse server response");
        }
    } else {
        console.error("Server error:", res.status, res.statusText);
        showToast("Error: Server error occurred");
    }

    
}



async function cashin() {  
    const recieveremail = document.getElementById("recieveremail").value;
    const password = document.getElementById("password").value;
    const youremail = document.getElementById("youremail").value;
    const amount = document.getElementById("amount").value;
    const reference = document.getElementById("reference").value;
    
    const user = { 
        recieveremail: recieveremail,
        password: password,
        amount: amount,
        youremail: youremail,
        reference:reference
    };
    
    const res = await fetch("http://localhost:4000/cashin", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    if (res.ok) {
        try {
            const response = await res.json();
            console.log(response.num);
            if (response.num === 1) { // Check the property "num" of the response
                showToast("Login Successful!");
                window.location.href = "http://127.0.0.1:5501/html/successful_agent.html";
            } else {
                showToast("Send money unsuccessful");
            }
        } catch (error) {
            console.error("Error parsing JSON response:", error);
            showToast("Error: Unable to parse server response");
        }
    } else {
        console.error("Server error:", res.status, res.statusText);
        showToast("Error: Server error occurred");
    }

   
}




async function signup_payment() {

    console.log("sign up")
    
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const account_type = document.getElementById("account_type").value;
    const confirmPassword = document.getElementById("confirm-password").value
    console.log(name);
    console.log(email);
    console.log(password);
    console.log(account_type);
    console.log(confirmPassword);
    


    if((name === "") || (email === "") || (password === "") || (confirmPassword === "")) {
        alert("No field should be empty.Try Again")
        return;
    }

    if (confirmPassword !== password) {
        showToast("Passwords Didn't Match.Try Again");
        const error = document.getElementById("error-msg")
        error.innerHTML = "<p>invaid</p>"
        return;
    }

    

        console.log("hello")
        
        code = Math.floor((Math.random()*1000000)+1);

        const newUser = {
            name: name,
            email: email,
            password: password,
            code: code,
            account_type:account_type
        }

        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem("username", name);
        localStorage.setItem("account_type", account_type);

        const res = await fetch("http://localhost:4000/signup_payment", {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
        })
        
        window.location.href = "../html/code.html";
        
}




async function signup_usercheck() {
    console.log("check code")
    const username = localStorage.getItem("username")
    const useremail = localStorage.getItem("useremail")
    const userpassword = localStorage.getItem("userpassword")

    const code1 = document.getElementById("verification-code").value
  

    const newUser = {
        username: username,
        useremail:useremail,
        userpassword:userpassword
    }

    
    const userCode = {
        useremail:useremail,
        code:code1
    }

    console.log(useremail)
   
    const res = await fetch("http://localhost:4000/userverify", {
        method: "POST",
        body: JSON.stringify(userCode),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    })

    const response = await res.json();

    console.log(response)

    await fetch("http://localhost:4000/userremovecode", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

    if(response === true) {
        
        showToast('Sign Up successful!');
        
        await fetch("http://localhost:4000/userinsert", {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        window.location.href = "http://127.0.0.1:5501/html/dashboard.html";
    }
    else {
        showToast("Code Didn't Match.Try Again");
        return;
    }
}




async function balance_check() {
    console.log("balance check")
   
    const useremail = localStorage.getItem("useremail")

  

    const newUser = {
        useremail:useremail 
       }

    console.log(useremail)
   
    const res = await fetch("http://localhost:4000/balance_check_user", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    })

    const response = await res.json();
    console.log(response.num);
    document.getElementById("balance_check_result").innerText = "Your balance: " + response.num;

}
