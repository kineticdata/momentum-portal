import logo from '../../assets/images/logo-full.svg';
import { Button } from '../../atoms/Button.jsx';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export const Login = loginProps => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="flex flex-col items-center gap-6 w-[556px] p-[24px_100px] bg-white rounded-xl shadow-lg">
      <LoginForm {...loginProps} />
    </div>
  </div>
);

export const LoginForm = loginProps => {
  const {
    error,
    onChangePassword,
    onChangeUsername,
    onLogin,
    onSso,
    password,
    pending,
    username,
  } = loginProps;

  return (
    <form className="self-center flex flex-col gap-5 items-stretch w-full max-w-96">
      <img src={logo} alt="Logo" className="h-12 object-contain mb-5 mt-5" />
      <div className="field">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          required={true}
          autoFocus
          value={username}
          onChange={onChangeUsername}
        />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          required={true}
          value={password}
          onChange={onChangePassword}
        />
      </div>
      {error && <p className="text-warning-500">{error}</p>}
      <Button
        type="submit"
        onClick={onLogin}
        disabled={pending || !username || !password}
      >
        Sign In
      </Button>
      {onSso && (
      <>
        <div className="flex justify-center items-center gap-2.5 text-gray-900 font-semibold leading-4">
          <hr className="inline w-16 border-gray-500" />
          OR
          <hr className="inline w-16 border-gray-500" />
        </div>
        <Button
          variant="secondary"
          type="button"
          onClick={onSso}
          disabled={pending}
        >
          Enterprise Single Sign-On
        </Button>
      </>
      )}
      <Link
        to="/reset-password"
        className={clsx(
          'flex justify-center items-center gap-1 text-gray-500 p-[10px_0px] font-semibold',
          'hover:underline hover:text-primary-900',
        )}
      >
        Forgot your password?
      </Link>
    </form>
  );
};
