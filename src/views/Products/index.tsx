import { useState } from "react";
import "./index.css";
import { Product } from "../../type";
import { NumberToVND } from "../../helper";
import { useProducts } from "../../hooks/useProduct";
import { DISCOUNT_AMOUNT } from "../../constant";
import { Pagination } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useUserStore } from "../../store/user";

function Products() {
  const level = useUserStore((state) => state.level);
  const categoires = useUserStore((state) => state.categoires);
  const discount = DISCOUNT_AMOUNT[+level - 1] ?? 0;
  const { categoryId } = useParams<{ categoryId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchName = queryParams.get("searchName");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, mutate: refreshProducts } = useProducts(
    currentPage,
    10,
    true,
    categoryId,
    searchName ?? ""
  );
  const products = data?.data ?? [];

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
    refreshProducts();
  };
  return (
    <div className="Products">
      <h3 style={{ marginLeft: "2rem" }}>Danh sách sản phẩm</h3>
      <div style={{ marginLeft: "2rem", marginRight: "2rem" }}>
        {categoires?.find((it) => it.id === categoryId)?.description}
      </div>
      <div className="products-container">
        {products.map((item: Product) => (
          <div key={item.id} className="grid-item">
            <Link
              to={`/product_detail/${item.id}`}
              className="Product-item-image-wrapper"
            >
              <img src={item.image} />
            </Link>
            <div className="product-name">{item.nameProduct}</div>
            {level && +level > 0 && (
              <div
                style={{
                  fontSize: "20px",
                  color: "red",
                  textDecoration: level && +level > 0 ? "line-through" : "",
                  fontWeight: "bold",
                }}
              >
                {NumberToVND.format(item.volumes[0]?.price)}
              </div>
            )}
            <div
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {level
                ? NumberToVND.format(
                    (item.volumes[0]?.price * (100 - discount)) / 100
                  )
                : NumberToVND.format(item.volumes[0]?.price)}
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
