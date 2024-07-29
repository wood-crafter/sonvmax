import { useCart } from "../../hooks/useCart";
import { Cart } from "../../type";
import "./index.css";

function UserCart() {
  const { data: currentCart } = useCart();

  return (
    <div className="Cart">
      {currentCart &&
        currentCart.map((item: Cart) => {
          return (
            <div key={item.id} className="cart-item">
              <div>{item.product.nameProduct}</div>
              <div>{item.product.price}</div>
              <div>{item.quantity}</div>
            </div>
          );
        })}
      {currentCart ? (
        <button style={{ marginLeft: "1rem", marginRight: "1rem" }}>
          Mua ngay
        </button>
      ) : (
        <div>Chưa có sản phẩm nào</div>
      )}
    </div>
  );
}

export default UserCart;
