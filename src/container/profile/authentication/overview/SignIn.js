import React, { useState, useCallback } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FacebookOutlined, TwitterOutlined } from '@ant-design/icons';
import { Auth0Lock } from 'auth0-lock';
import { GoogleLogin } from '@react-oauth/google';
import { AuthWrapper } from './style';
import { login } from '../../../../redux/authentication/actionCreator';
import { Checkbox } from '../../../../components/checkbox/checkbox';
import Heading from '../../../../components/heading/heading';
import { auth0options } from '../../../../config/auth0';
import { useGoogleContext } from '../../../../context/GoogleContext';

const { Text } = Typography;

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

function SignIn() {
  const googleContext = useGoogleContext();
  const { handleAuthClick } = googleContext;
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const [form] = Form.useForm();
  const [state, setState] = useState({
    checked: null,
  });

  const lock = new Auth0Lock(clientId, domain, auth0options);

  const handleSubmit = useCallback(
    (values) => {
      console.log('values :>> ', values);
      dispatch(login(values));
      // history.push('/admin');
    },
    [dispatch],
  );

  const onChange = (checked) => {
    setState({ ...state, checked });
  };

  // lock.on('authenticated', (authResult) => {
  //   lock.getUserInfo(authResult.accessToken, (error) => {
  //     if (error) {
  //       return;
  //     }

  //     handleSubmit();
  //     lock.hide();
  //   });
  // });

  return (
    <AuthWrapper>
      <p className="auth-notice">
        Don&rsquo;t have an account? <NavLink to="/register">Sign up now</NavLink>
      </p>
      <div className="auth-contents">
        <Form name="login" form={form} onFinish={handleSubmit} layout="vertical">
          <Heading as="h3">
            Sign in to <span className="color-secondary">Admin</span>
          </Heading>
          <Form.Item
            name="email"
            rules={[{ message: 'Please input your username or Email!', required: true }]}
            initialValue="example@example.com"
            label="Email Address"
          >
            <Input />
          </Form.Item>
          <Form.Item name="password" initialValue="123456789" label="Password">
            <Input.Password placeholder="Password" />
          </Form.Item>
          <div className="auth-form-action">
            <Checkbox onChange={onChange} checked={state.checked}>
              Keep me logged in
            </Checkbox>
            <NavLink className="forgot-pass-link" to="/forgotPassword">
              Forgot password?
            </NavLink>
          </div>
          <Form.Item>
            <Button className="btn-signin" htmlType="submit" type="primary" size="large">
              {isLoading ? 'Loading...' : 'Sign In'}
            </Button>
          </Form.Item>
          {error && <Text type="danger">{error}</Text>}
          <p className="form-divider">
            <span>Or</span>
          </p>
          <ul className="social-login">
            <li>
              <Button className="google-signup" onClick={handleAuthClick}>
                <img src={require('../../../../static/img/google.png')} alt="" />
                <span>Sign in with Google</span>
              </Button>
              {/* <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log(credentialResponse);
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              /> */}
            </li>
            <li>
              <Link className="facebook-sign" to="#">
                <FacebookOutlined />
              </Link>
            </li>
            <li>
              <Link className="twitter-sign" to="#">
                <TwitterOutlined />
              </Link>
            </li>
          </ul>
          <div className="auth0-login">
            <Link to="#" onClick={() => lock.show()}>
              Sign In with Auth0
            </Link>
            <Link to="/fbSignIn">Sign In With Firebase</Link>
          </div>
        </Form>
      </div>
    </AuthWrapper>
  );
}

export default SignIn;
