import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register()
{
    const [registerMessage,setMessage] = useState('');
    const [registerFirstName,setFirstName] = React.useState('');
    const [registerLastName,setLastName] = React.useState(''); 
    const [registerUsername,setLoginName] = React.useState('');
    const [registerPassword,setPassword] = React.useState('');
    const [registerEmail,setEmail] = React.useState('');
    const [verificationToken, setVerificationToken] = React.useState('');
    const app_name = 'galaxycollapse.com';

    function buildPath(route:string) : string
    {
        if (process.env.NODE_ENV != 'development')
        {
            return 'https://' + app_name + '/' + route;
        }
        else
        {
            return 'http://localhost:5000/' + route;
        }
    }

    function handleSetRegisterFirstName (e: any) : void
    {
        setFirstName (e.target.value);
    }

    function handleSetRegisterLastName (e: any) : void
    {
        setLastName (e.target.value);
    }

    function handleSetRegisterEmail (e: any) : void
    {
        setEmail (e.target.value);
    }

    function handleSetRegisterUsername( e: any ) : void
    {
      setLoginName( e.target.value );
    }
    
    function handleSetRegisterPassword( e: any ) : void
    {
      setPassword( e.target.value );
    }

    function handleSetVerificationToken( e: any ) : void
    {
      setVerificationToken( e.target.value );
    }
    
    async function doRegister(event:any) : Promise<void>
    {
        event.preventDefault();

        var obj = {us: registerUsername, pass: registerPassword, f: registerFirstName, l: registerLastName, em: registerEmail};

        if (obj.us == "" || obj.pass == "" || obj.f == "" || obj.l == "" || obj.em == "")
        {
            setMessage("One or more fields missing");
            return;
        }

        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(buildPath("api/register"),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
  
            var res = JSON.parse(await response.text());
            console.log(res);

            let registrationForm = document.getElementById("registrationForm") as HTMLDivElement;
            registrationForm.style.display = "none";
            let verificationForm = document.getElementById("verificationForm") as HTMLDivElement;
            verificationForm.style.display = "block";
            setMessage('Please enter the verification token sent to your email');
        }
        catch(error:any)
        {
            setMessage('Unsuccessful Registration...');
            alert(error.toString());
            return;
        }    
    }   

    async function doVerify(event:any) : Promise<void>
    {
        // Use api endpoint to connect to MongoDB and verify that the user entered the correct
        // token. If so, set MongoDB's user flag to true. The user should be able to login.
        
        // Tweak Login.tsx so that only user's that have flag to true can log in. 

        event.preventDefault();

        var obj = {verificationToken: verificationToken};

        var js = JSON.stringify(obj);
        console.log(js);
    }

    return(
        <div id="registerDiv"> 
            <div id="registrationForm">
                <h1> Registration </h1>
                <br></br>
                <input type="text" id="registerFirstName" placeholder="Enter first name here" onChange={handleSetRegisterFirstName} />
                <br></br>
                <input type="text" id="registerLastName" placeholder="Enter last name here" onChange={handleSetRegisterLastName} />
                <br></br>
                <input type="text" id="registerUsername" placeholder="Enter username here" onChange={handleSetRegisterUsername} />
                <br></br>
                <input type="password" id="registerPassword" placeholder="Enter password here" onChange={handleSetRegisterPassword} />
                <br></br>
                <input type="email" id="registerEmail" placeholder="Enter email here" pattern=".+@example\.com" onChange={handleSetRegisterEmail}  required />
                <br></br>
                <input type="submit" id="registerButton" className="buttons" value = "Submit" onClick={doRegister}/>
                <br></br>
            </div>
            <div id="verificationForm" style={{display: "none"}}>
                <h1> Verify </h1>
                <div id="registerResult">{registerMessage}</div>
                <br></br>
                <input type="text" id="verifyToken" placeholder="Enter verification token here" onChange={handleSetVerificationToken} />
                <br></br>
                <input type="submit" id="verifyButton" className="buttons" value = "Submit" onClick={doVerify}/>
            </div>
            <br></br>
            <Link to="/" className="returnLink">Return to Login</Link>
        </div>
    );
};

export default Register;