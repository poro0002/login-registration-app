

let output;
        
document.addEventListener('DOMContentLoaded', () => {
    
     output = document.querySelector('#output');
     document.querySelector("#btnLive").addEventListener('click', goLive)
     document.querySelector("#btnToken").addEventListener('click', getToken)
     document.querySelector("#btnVerify").addEventListener('click', verifyToken)
     document.querySelector("#darkMode").addEventListener('click', toggleDarkMode)

     document.querySelector(".register-btn").addEventListener('click', submitRegData)
     document.querySelector(".login-btn").addEventListener('click', submitLogData)

     
     
 })

 function submitRegData(e) {
    e.preventDefault();

    //error element
    let errorMsg = document.querySelector(".regFormError");
    errorMsg.textContent = "";

    const name = document.querySelector('#fName').value;
    const username = document.querySelector('#uName').value;
    const password = document.querySelector('#pass').value;
    const confirmPass = document.querySelector('#confirmPass').value;
    const email = document.querySelector('#email').value;
    const telephone = document.querySelector('#tel').value;
    

 let registerRules = [
    {usernameRules:[
        {condition: value => {
          return value.length >= 6;
      }, message: () => errorMsg.textContent =  "username must be at least 6 digits long" }
    ]},
     {passwordRules: [
        { condition: value => value.length >= 8, message: () => errorMsg.textContent = "Password must be at least 8 characters long."},
        { condition: value => /[a-z]/.test(value), message: () => errorMsg.textContent = "Password must contain at least one lowercase letter." },
        { condition: value => /[A-Z]/.test(value), message: () => errorMsg.textContent =  "Password must contain at least one uppercase letter." },
        { condition: value => /\d/.test(value), message: () => errorMsg.textContent =  "Password must contain at least one digit." },
        { condition: value => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value), message: () => errorMsg.textContent =  "Password must contain at least one of the symbols." },
      ]},
      {emailRules:[
        {condition: value => /^[^ ]+@[a-zA-Z0-9.-]+\.[a-z]{2,3}$/.test(value), 
        message: () => errorMsg.textContent =  "Must be a valid Email", },
      ]},
      {phoneRules:[
          {condition: value => {
            return value.length >= 10;
        }, message: () => errorMsg.textContent =  "you must provide a valid phone number"}
      ]},
 ];

// ACCESS CONDITIONS
    let usernameCondition = registerRules[0].usernameRules[0].condition;
// you must map is first because you cant loop through the object conditions in the register rules
// to get the corresponding error message to run we have do this at the map stage instead of the every 
// So it's imperative to do this at the Map stage because it doesn't require everything to pass. 
    
let passwordConditions = true; 
    registerRules[1].passwordRules.forEach(rule => {
        if (!rule.condition(confirmPass)) {
            rule.message(); 
            passwordConditions = false; 
        }
    });

    let emailCondition = registerRules[2].emailRules[0].condition;
    let phoneCondition = registerRules[3].phoneRules[0].condition;

    // loop through the multiple password conditions and make sure the all run true with the every function 
    // let confirmPasswordConditions = passwordConditions.every(condition => condition(confirmPass));
   
    let passMatch =  password == confirmPass ?  true : false; 
    if(!passMatch){
        errorMsg.textContent =  "Passwords don't match"
    }

    let acceptedTOS = document.querySelector(".checkbox").checked;

    if(!acceptedTOS){
        errorMsg.textContent =  "Please accept the Terms of Service First"
    }
   
    
if(usernameCondition(username) && passwordConditions && passMatch && emailCondition(email) && phoneCondition(telephone) && acceptedTOS ){

 // successful request code 
    let subRegHeader = new Headers();
    subRegHeader.append('Content-Type', 'application/json');
    let regReqOpts = {
        method: "POST",
        mode: "cors",
        headers: subRegHeader,
        
        body: JSON.stringify({

            fullName: name,
            username: username,
            pass: password,
            email: email,
            phone: telephone,
        }),

    }
    let regUrl = baseURL + "register";
    let req = new Request(regUrl, regReqOpts)

     fetch(req)
        .then(res => {
            // if (!res.ok) {
            //     throw new Error('Request failed with status: ' + res.status);
            // }
            return res.json()
        })
        .then(data => {
            console.log(data)
            if(data.error === "username is taken"){
                errorMsg.textContent = data.error; 
            } else if(data.error === "There is an account associated with this email already"){
                errorMsg.textContent = data.error; 
            } else if(data.error == "There is an account associated with this phone number already"){
                errorMsg.textContent = data.error; 
            }
        })
        .catch(err => {
            console.log("something went wrong", err)
        })
   };

};

 function submitLogData(e){
    e.preventDefault();
    let subLogHeader = new Headers();
    subLogHeader.append('Content-Type', 'application/json');

    let logReqOpts = {
        method: "POST",
        mode: "cors",
        headers: subLogHeader,
        
        body: JSON.stringify({

            username: document.querySelector('#logUname').value,
            pass: document.querySelector('#logPass').value,
           
        }),

    }
    let logUrl = baseURL + "login";

    let req = new Request(logUrl, logReqOpts)


     fetch(req)
        .then(res => {
            if (!res.ok) {
                throw new Error('Request failed with status: ' + res.status);
            }
            return res.json()
        })
        .catch(err => {
            console.log("something went wrong", err)
        })
    }
 



 function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
  }

 const baseURL = 'http://127.0.0.1:3000/';

 function goLive(e){
    //check if server is live
       fetch(baseURL)
         .then(res => {
            return res.json()
         })
         .then(content => {
           output.innerHTML = JSON.stringify(content, '\n', 2) 
         })
         .catch((error) => console.error)
 }

 function getToken(e){
     // get a token
       fetch(baseURL + 'token')
         .then(res => {
            return res.json()
         })
         .then(tokenObj => {
             output.innerHTML = JSON.stringify(tokenObj, '\n', 2) 
             let token = tokenObj.data;
             localStorage.setItem("webToken", token);

         })
         .catch((error) => console.error)
 }

 function verifyToken(e){
     // verify and make sure the token is still valid
        let token = localStorage.getItem("webToken");
        let h = new Headers();
        h.append("Authorization", `Bearer ${token}`);
        let testUrl = baseURL + 'test';
        let options = {
             headers: h,
             method: "GET"
        }
        let req = new Request(testUrl, options);

     
        fetch(req)
         .then(res => {
            return res.json()
         })
         .then(validity => {
             output.innerHTML = JSON.stringify(validity, '\n', 2) 
             if(validity.code > 0){
                 // error happened
                 localStorage.removeItem("webToken");
             }
         })
         .catch((error) => console.error)
 }