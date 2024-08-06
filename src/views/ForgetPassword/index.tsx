import { Link } from "react-router-dom";
import "./index.css";

function ForgetPassword() {
  return (
    <div className="ForgetPassword">
      <div className="container">
        <div className="title">Quên mật khẩu</div>
        <input className="input-email" type="email" placeholder="Email" />
        <div className="action">
          <button>Gửi mail</button>
          <Link to="/login">
            <button>Đăng nhập</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
