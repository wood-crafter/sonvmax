/* eslint-disable react/jsx-no-target-blank */
import { Link } from "react-router-dom";
import "./index.css";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

function Footer() {
  return (
    <div className="Footer">
      <div className="about">
        <div className="about-column">
          <h5 style={{ color: "#fff" }}>LIÊN HỆ VỚI CHÚNG TÔI</h5>
          <h4 style={{ color: "#fff" }}>CÔNG TY CỔ PHẦN SƠN VMAX</h4>
          <p style={{ color: "#fff" }}>
            MST: 0107587937 Do Sở kế hoạch và đầu tư TP.HN cấp ngày 06/10/2016
          </p>

          <div>
            <a href="/">
              <img alt="Sơn VMAX" src="/public/logoa14d.png" width="100%" />
            </a>
          </div>

          <p style={{ color: "#fff" }}>
            <EnvironmentOutlined style={{ color: "#f5a515" }} /> LK1-D06, KĐT
            Splendora - Mailand Hanoi City, An Khánh, Hoài Đức, Hà Nội
          </p>

          <p style={{ color: "#fff" }}>
            <PhoneOutlined style={{ color: "#f5a515" }} /> 096.555.8485
          </p>
          <p style={{ color: "#fff" }}>
            <MailOutlined style={{ color: "#f5a515" }} />
            <span style={{ color: "#f5a515" }}> vmaxpaint@gmail.com</span>
          </p>
        </div>
        <div className="about-column">
          <h4 style={{ color: "#fff" }}>Danh mục</h4>
          <Link to="/">
            <h5 className="link">Trang chủ</h5>
          </Link>
          <Link to="/products">
            <h5 className="link">Sản phẩm</h5>
          </Link>
        </div>
        <div className="about-column">
          <h4 style={{ color: "#fff" }}>Chính sách</h4>
        </div>
        <div className="about-column">
          <h4 style={{ color: "#fff" }}>Liên hệ</h4>
          <Link to="https://www.facebook.com/VMAXPaint/">
            <h5 className="link">Facebook</h5>
          </Link>
          <Link to="http://zalo.me/">
            <h5 className="link">Zalo</h5>
          </Link>
        </div>
        <div className="about-column">
          <h4 style={{ color: "#fff" }}>Mạng xã hội</h4>
          <a href="http://online.gov.vn/Home/WebDetails/96201" target="_blank">
            <img
              src="/public/bcta14d.png"
              style={{ maxWidth: "60%", marginTop: "20px" }}
            />
          </a>
        </div>
      </div>
      <div className="credit">
        <div>
          <p style={{ fontSize: "14px" }}>
            © Bản quyền thuộc về VMAX Paint JSC. | Cung cấp bởi{" "}
            <Link style={{ color: "#f8f8f8" }} to="/">
              VMAX
            </Link>
          </p>
        </div>
        <div>
          <Link to="/">
            <img alt="Sơn VMAX" src="/public/g6a14d.png" />
          </Link>
          <Link to="/">
            <img alt="Sơn VMAX" src="/public/g5a14d.png" />
          </Link>
          <Link to="/">
            <img alt="Sơn VMAX" src="/public/g4a14d.png" />
          </Link>
          <Link to="/">
            <img alt="Sơn VMAX" src="/public/g1a14d.png" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
