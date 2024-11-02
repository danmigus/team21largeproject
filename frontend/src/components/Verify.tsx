import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Verify()
{
    const [verificationToken, setVerificationToken] = React.useState('');
    const [verifyEmail,setEmail] = React.useState('');
    const [verifyMessage,setMessage] = useState('');
    const app_name = 'galaxycollapse.com';

    function handleSetVerificationToken( e: any ) : void
    {
        setVerificationToken( e.target.value );
    }
    
    function handleSetVerifyEmail(e:any) : void
    {
        setEmail(e.target.value);
    }

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

    async function sendEmail(event:any) : Promise<void>
    {
        event.preventDefault();
        
        console.log("sending email...");

        // Insert SendGrid backend call here.

        setMessage("Email sent 😮‍💨📧");

        let verifyPartOne = document.getElementById("verifyPartOne") as HTMLDivElement;
        verifyPartOne.style.display = "none";
        let verifyPartTwo = document.getElementById("verifyPartTwo") as HTMLDivElement;
        verifyPartTwo.style.display = "block";
    }

    async function doVerify(event:any) : Promise<void>
    {
        // Use api endpoint to connect to MongoDB and verify that the user entered the correct
        // token. If so, set MongoDB's user flag to true. The user should be able to login.

        event.preventDefault();

        var obj = {token: verificationToken, email: verifyEmail};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(buildPath("api/verify"),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
  
            var res = JSON.parse(await response.text());

            if (res.error === '0')
                setMessage('✅ Successful verification. Please return to login');
            else
                setMessage('❌ Unsuccessful verification');
        }
        catch(error:any)
        {
            setMessage('❌ Something went wrong...');
            alert(error.toString());
            return;
        }    

    }
    return(
        <div id="verificationForm">
            <h1> Verify </h1>
            <div id="verifyResult">{verifyMessage}</div>
            <br></br>
            <div id="verifyPartOne">
                <input type="email" id="verifyEmail" placeholder="Enter the email you want to verify" onChange={handleSetVerifyEmail} />
                <br></br>
                <input type="submit" id="verifyEmailButton" className="buttons" value = "Submit" onClick={sendEmail}/>
                <br></br>
            </div>
            <div id="verifyPartTwo" style={{display:'none'}}>
                <input type="text" id="verifyToken" placeholder="Enter verification token here" onChange={handleSetVerificationToken} />
                <br></br>
                <input type="submit" id="verifyTokenButton" className="buttons" value = "Submit" onClick={doVerify}/>
                <br></br>
            </div>
            <Link to="/" className="returnLink">Return to Login</Link>
        </div>
    );
};

export default Verify;