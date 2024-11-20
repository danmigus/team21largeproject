import Register from '../components/Register.tsx';

const RegisterPage = () =>
{

    return(
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'repeat url(../src/assets/pattern.png)'}}>
        <Register />
      </div>

    );
};

export default RegisterPage;
