import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login()
{
  const [message,setMessage] = useState('');
  const [loginName,setLoginName] = React.useState('');
  const [loginPassword,setPassword] = React.useState('');
  const app_name = 'galaxycollapse.com';

  function handleSetLoginName( e: any ) : void
  {
    setLoginName( e.target.value );
  }
  
  function handleSetPassword( e: any ) : void
  {
    setPassword( e.target.value );
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
  
  async function doLogin(event:any) : Promise<void>
  {
      event.preventDefault();

      var obj = {login:loginName,password:loginPassword};
      var js = JSON.stringify(obj);

      try
      {    
          const response = await fetch(buildPath("api/login"),
              {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

          var res = JSON.parse(await response.text());

          if( res.id <= 0 )
          {
              setMessage('Incorrect user credentials or verification needed');
          }
          else
          {
              var user = {firstName:res.firstName,lastName:res.lastName,email:res.em, id:res.id}
              localStorage.setItem('user_data', JSON.stringify(user));

              setMessage('');
              window.location.href = '/analyze';
          }
      }
      catch(error:any)
      {
          alert(error.toString());
          return;
      }    
    };


    return(
      <div id="loginDiv">
        <span id="inner-title">PLEASE LOG IN</span><br />
        <input type="text" id="loginName" placeholder="Username" onChange={handleSetLoginName} />
        <br></br><input type="password" id="loginPassword" placeholder="Password" onChange={handleSetPassword} />
        <br></br><input type="submit" id="loginButton" className="buttons" value = "Login"
          onClick={doLogin} />
        <br></br> <br></br>
        <Link to="/register" className="registerLink">Register Now</Link>
        <br></br>
        <Link to="/resend" className="resendPage">Resend Email Verification</Link>
        <div id="loginResult">{message}</div>
     </div>
    );
};

export default Login;
