import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Resend()
{
    const [verifyEmail,setEmail] = React.useState('');
    const [verifyMessage,setMessage] = useState('');
    const app_name = 'galaxycollapse.com';

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

    async function doVerify(event:any) : Promise<void>
    {
        // Use api endpoint to connect to MongoDB and verify that the user entered the correct
        // token. If so, set MongoDB's user flag to true. The user should be able to login.

        event.preventDefault();

        let verifyPartOne = document.getElementById("verifyPartOne") as HTMLDivElement;
        verifyPartOne.style.display = "none";
        let verifyPartTwo = document.getElementById("verifyPartTwo") as HTMLDivElement;
        verifyPartTwo.style.display = "block";

        var obj = { email: verifyEmail};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(buildPath("api/resend"),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
  
            var res = JSON.parse(await response.text());

            if (res.error === 'Updated Token')
                setMessage('✅ Updated token. Please return to login');
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
            <h1> Resend email for verification 📧 </h1>
            <div id="verifyResult">{verifyMessage}</div>
            <br></br>
            <div id="verifyPartOne">
                <input type="email" id="verifyEmail" placeholder="Enter the email you want to verify" onChange={handleSetVerifyEmail} />
                <br></br>
                <input type="submit" id="verifyEmailButton" className="buttons" value = "Submit" onClick={doVerify}/>
                <br></br>
            </div>
            <div id="verifyPartTwo" style={{display:'none'}}>
                <h2>Thank you. Please check your email.</h2>
            </div>
            <Link to="/" className="returnLink">Return to Login</Link>
        </div>
    );
};

export default Resend;