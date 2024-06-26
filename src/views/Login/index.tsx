import './index.css'

function Login() {
  return (
    <div className='login-body'>
      <div className='login-form-container'>
        <div className='login-form-title'>
          Đăng nhập
        </div>
        <div className='signin-signout-switcher'>
          <button id='button-switcher-active'>
            Đăng nhập
          </button>
          <button>
            Đăng ký
          </button>
        </div>
        <div className='login-form-inputs'>
          <input type='email' placeholder='Email'/>
          <input type='password' placeholder='Mật khẩu'/>
        </div>
        <a className='forget-password'>Quên mật khẩu</a>
        <button className='login-button'>
          Đăng nhập
        </button>
        <div className='no-account'>
          <h5>Chưa có tài khoản?</h5>
          <a>Đăng ký ngay</a>
        </div>
      </div>
    </div>
  )
}

export default Login
