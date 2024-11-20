// import PageTitle from '../components/PageTitle.tsx';
import Login from '../components/Login.tsx';

const LoginPage = () =>
{

    return(
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'url(../src/assets/pattern.png)'}}>
        <img className="football-logo"src="./src/assets/football.JPG"></img>
        {/*<PageTitle />*/}
        <Login />
      </div>
    );
};

export default LoginPage;
