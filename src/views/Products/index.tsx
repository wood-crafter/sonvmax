import { useState } from "react";
import "./index.css";
import { Product } from "../../type";
import { NumberToVND } from "../../helper";
import { useProducts } from "../../hooks/useProduct";
import { DISCOUNT_AMOUNT, ITEM_PER_ROW } from "../../constant";
import { Pagination } from "antd";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useUserStore } from "../../store/user";

function Products() {
  const level = useUserStore((state) => state.level);
  const discount = DISCOUNT_AMOUNT[+level - 1] ?? 0;
  const { categoryId } = useParams<{ categoryId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, mutate: refreshProducts } = useProducts(
    currentPage,
    10,
    categoryId
  );
  const products = data?.data ?? [];

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
    refreshProducts();
  };
  return (
    <div className="Products">
      <h3 style={{ marginLeft: "2rem" }}>Danh sách sản phẩm</h3>
      <div
        className="products-container"
        style={{ gridTemplateColumns: `repeat(${ITEM_PER_ROW}, 1fr)` }}
      >
        {products.map((item: Product) => (
          <div key={item.id} className="grid-item">
            <Link to={`/product_detail/${item.id}`}>
              <img src={item.image} style={{ height: "70%", width: "100%" }} />
            </Link>
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.nameProduct}
            </div>
            {level && (
              <div
                style={{
                  fontSize: "20px",
                  color: "red",
                  textDecoration: "line-through",
                  fontWeight: "bold",
                }}
              >
                {NumberToVND.format(item.price)}
              </div>
            )}
            <div
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {level
                ? NumberToVND.format((item.price * (100 - discount)) / 100)
                : NumberToVND.format(item.price)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          onChange={onPageChange}
          defaultPageSize={10}
          total={data?.totalRecord}
        />
      </div>
    </div>
  );
}

export default Products;
