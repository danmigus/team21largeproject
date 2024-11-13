import { useState } from 'react';
import { Link } from 'react-router-dom';

function SetPassword()
{
    const [message,setMessage] = useState('');
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const app_name = 'galaxycollapse.com';

    function handleSetEmail (e:any) : void
    {
        setEmail(e.target.value);
    }

    function handleSetPassword (e:any) : void
    {
        setPassword(e.target.value);
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

    
    async function setNewPassword(event:any) : Promise<void>
    {
        event.preventDefault();

        let obj = { email , newPassword: password};
        let js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath("api/setpassword"),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            console.log(res);
            setMessage("New password set");
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
                <h1> Change Password🔑</h1>
                <div id="result">{message}</div>
                <br></br>
                <input type="email" id="email" placeholder="Re-enter email here" onChange={handleSetEmail} />
                <br></br>
                <input type="password" id="password" placeholder="Enter new password here" onChange={handleSetPassword} />
                <br></br>
                <input type="submit" id="resetPasswordButton" className="buttons" value = "Submit" onClick={setNewPassword}/>
                <br></br>
            </div>
            <br></br>
            <Link to="/" className="returnLink">Return to Login</Link>
        </div>
    );
}

export default SetPassword;