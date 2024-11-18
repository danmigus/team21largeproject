import { useState } from 'react';
import { Link } from 'react-router-dom';

function ResetPassword()
{
    const [message,setMessage] = useState('');
    const [email,setEmail] = useState('');
    const app_name = 'galaxycollapse.com';

    function handleSetEmail (e:any) : void
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

    async function resetPassword(event:any) : Promise<void>
    {
        event.preventDefault();

        let obj = { email };
        let js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath("api/resetpassword"),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            console.log(res);
            setMessage("Please check your email for a password reset link.");
            return;
        }

        catch (error:any)
        {
            console.log(error.toString());
            return;
        }
    }
    
    return(
        <div id="passwordResetDiv">
            <div id="passwordResetForm"> 
                <h1> Reset Password 🔑</h1>
                <div id="result">{message}</div>
                <br></br>
                <input type="email" id="email" placeholder="Enter email here" onChange={handleSetEmail} />
                <br></br>
                <input type="submit" id="resetPasswordButton" className="buttons" value = "Submit" onClick={resetPassword}/>
                <br></br>
                <Link to="/" className="returnLink">Return to Login</Link>
            </div>
        </div>
    );
}

export default ResetPassword;