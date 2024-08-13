import { FormEventHandler, useState } from "react";
import "./index.css";
import { useUserStore } from "../../store/user";
import { Link, useNavigate } from "react-router-dom";
import { ADMIN_ROLES } from "../../constant";
import { useLogin } from "../../hooks/useAuth";
import { useMeMutation } from "../../hooks/useMe";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { trigger } = useLogin();
  const { trigger: triggerMe } = useMeMutation();
  const setAccessToken = useUserStore((state) => state.setAccessToken);
  const setUserInformation = useUserStore((state) => state.setUserInformation);

  const handleLogin: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!password) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    const res = await trigger({
      username: email,
      password,
    });

    if (res.accessToken) {
      const payload = res.accessToken.split(".")[1];
      const roleName = JSON.parse(atob(payload)).roleName;
      setAccessToken(res.accessToken);
      const me = await triggerMe();
      setUserInformation(me);

      if (!ADMIN_ROLES.includes(roleName)) {
        navigate("/home");
      } else {
        navigate("/manage/products");
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="Login">
      <form className="login-form-container" onSubmit={handleLogin}>
        <div className="login-form-title">Đăng nhập</div>
        <div className="login-form-inputs">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <Link to="/forget_password" className="forget-password">
          Quên mật khẩu
        </Link>
        <button className="login-button" type="submit">
          Đăng nhập
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div className="no-account"></div>
      </form>
    </div>
  );
}

export default Login;
