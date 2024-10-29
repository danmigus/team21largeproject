import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register()
{
    const [registerMessage,setMessage] = useState('');
    const [registerName,setLoginName] = React.useState('');
    const [registerPassword,setPassword] = React.useState('');
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

    function handleSetRegisterName( e: any ) : void
    {
      setLoginName( e.target.value );
    }
    
    function handleSetRegisterPassword( e: any ) : void
    {
      setPassword( e.target.value );
    }
    
    // In progress
    async function doRegister(event:any) : Promise<void>
    {
        event.preventDefault();
        window.alert("Not working yet!")

        var obj = {registerName, registerPassword};
        var js = JSON.stringify(obj);
        js
        buildPath("Hi");
        setMessage("Hi");
    }   

    return(
        <div id="registerDiv"> 
            <h1> Registration </h1>
            <br></br>
            <input type="text" id="registerName" placeholder="Username" onChange={handleSetRegisterName} />
            <br></br>
            <input type="password" id="registerPassword" placeholder="Password" onChange={handleSetRegisterPassword} />
            <br></br>
            <input type="submit" id="registerButton" className="buttons" value = "Submit" onClick={doRegister}/>
            <br></br><br></br>
            <span id="registerResult">{registerMessage}</span>
            <br></br>
            <Link to="/" className="returnLink">Return to Login</Link>
        </div>
    );
};

export default Register;