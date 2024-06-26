import './index.css'

function ForgetPassword() {
  return (
    <div className='forget-password-body'>
      <div className='forget-password-form-container'>
        <div className='forget-form-title'>Quên mật khẩu</div>
        <input
          className='forget-password-input-email'
          type='email'
          placeholder='Email'
        />
        <div className='forget-password-action'>
          <button>
            Gửi mail
          </button>
          <button>
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword
