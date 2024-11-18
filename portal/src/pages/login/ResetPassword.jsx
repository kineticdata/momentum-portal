import { useCallback, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { createSubmission, getCsrfToken } from '@kineticdata/react';
import { useSelector } from 'react-redux';
import { LoginHeader } from './Login.jsx';
import { Button } from '../../atoms/Button.js';

export const ResetPassword = () => {
  let { token } = useParams();
  let [searchParams] = useSearchParams();

  return (
    <>
      <LoginHeader>
        <Button
          variant="tertiary"
          inverse
          icon="arrow-left"
          to="/login"
          aria-label="Return to Login"
        />
      </LoginHeader>
      {token ? (
        <ResetPasswordChangeForm
          token={token}
          username={decodeURIComponent(searchParams.get('u'))}
        />
      ) : (
        <ResetPasswordRequestForm />
      )}
    </>
  );
};

const ResetPasswordRequestForm = () => {
  const kappSlug = useSelector(state => state.app.kappSlug);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // State for username field
  const [username, setUsername] = useState('');
  const onChangeUsername = useCallback(e => {
    setUsername(e.target.value);
  }, []);

  // Handler to request password reset
  const submitRequest = useCallback(
    async e => {
      e.preventDefault();
      const { error } = await createSubmission({
        kappSlug,
        formSlug: 'password-reset',
        values: { Username: username },
        public: true,
      });

      if (error) {
        setError('There was a problem requesting a password reset.');
      } else {
        setSubmitted(true);
      }
    },
    [username, kappSlug],
  );

  return (
    <form className="self-center flex flex-col gap-5 items-stretch w-full max-w-96">
      <div className="field">
        <label htmlFor="username">Username</label>
        <input
          id="email"
          type="text"
          name="username"
          required={true}
          autoFocus
          value={username}
          onChange={onChangeUsername}
          disabled={submitted}
        />
      </div>
      {submitted && (
        <p>
          Your request has been submitted. You should receive an email with a
          password reset link shortly.
        </p>
      )}
      {error && <p className="text-warning-500">{error}</p>}
      <Button
        type="submit"
        onClick={submitRequest}
        disabled={!username || submitted}
      >
        Reset Password
      </Button>
    </form>
  );
};

const ResetPasswordChangeForm = ({ token, username }) => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // State and change handlers for new password fields
  const [password, setPassword] = useState('');
  const onChangePassword = useCallback(e => {
    setPassword(e.target.value);
  }, []);
  const [confirmPassword, setConfirmPassword] = useState('');
  const onChangeConfirmPassword = useCallback(e => {
    setConfirmPassword(e.target.value);
  }, []);

  // State for tracking when each password field has been touched so that we
  // can start validating them after both have been filled out. Start with an
  // array with both field names, and use a blur handler to remove the ones
  // that have been touched.
  const [untouchedFields, setUntouchedFields] = useState([
    'password',
    'passwordConfirmation',
  ]);
  const onBlurPasswordField = useCallback(e => {
    setUntouchedFields(fields =>
      fields.filter(field => field !== e.target.name),
    );
  }, []);
  // Only check password mismatch after both fields have been touched
  const passwordMismatch =
    untouchedFields.length === 0 && password !== confirmPassword;

  // Handler to submit the new password
  const submitRequest = useCallback(
    async e => {
      e.preventDefault();
      setSubmitted(true);
      const response = await fetch(`/app/reset-password/token`, {
        method: 'POST',
        body: new URLSearchParams({
          username,
          password,
          confirmPassword,
          token,
        }),
        headers: { 'X-XSRF-TOKEN': getCsrfToken() },
      });

      if (response.status === 302) {
        navigate('/');
        // TODO toast password reset success
      } else {
        try {
          const json = await response.json();
          if (json.error) setError(json.error);
        } catch (e) {
          setError(
            'There was a problem resetting your password! Please note that password reset links may only be used once.',
          );
        }
      }
    },
    [navigate, username, password, confirmPassword, token],
  );

  return (
    <form className="self-center flex flex-col gap-5 items-stretch w-full max-w-96">
      {!token || !username ? (
        <>The reset password link is invalid.</>
      ) : (
        <>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="email"
              type="text"
              name="username"
              required={true}
              value={username}
              disabled={true}
            />
          </div>
          <div className="field">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              name="password"
              required={true}
              disabled={submitted}
              value={password}
              onChange={onChangePassword}
              onBlur={onBlurPasswordField}
            />
          </div>
          <div className="field">
            <label htmlFor="passwordConfirmation">Confirm Password</label>
            <input
              id="passwordConfirmation"
              type="password"
              name="passwordConfirmation"
              required={true}
              disabled={submitted}
              value={confirmPassword}
              onChange={onChangeConfirmPassword}
              onBlur={onBlurPasswordField}
            />
          </div>
          {passwordMismatch && (
            <p className="text-warning-500">Passwords must match.</p>
          )}
          {error && <p className="text-warning-500">{error}</p>}

          <Button
            type="submit"
            onClick={submitRequest}
            disabled={
              submitted || !password || !confirmPassword || passwordMismatch
            }
          >
            Reset Password
          </Button>
        </>
      )}
    </form>
  );
};
