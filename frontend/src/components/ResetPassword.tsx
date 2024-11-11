import { useState, useEffect } from 'react';

function ResetPassword()
{
    const [message,setMessage] = useState('');
    const [email,setEmail] = useState('');

    function handleSetEmail (e:any) : void
    {
        setEmail(e.target.value);
    }

    async function doResetPassword(event:any) : Promise<void>
    {
        event.preventDefault();
    }
    
    return(
        <div>
            <div>
                <h1> Reset Password 🔑</h1>
                <div id="result">{message}</div>
                <br></br>
                <input type="email" id="email" placeholder="Enter email here" onChange={handleSetEmail} />
                <br></br>
                <input type="submit" id="resetPasswordButton" className="buttons" value = "Submit" onClick={doResetPassword}/>
                <br></br>
            </div>
        </div>
    );
}

export default ResetPassword;