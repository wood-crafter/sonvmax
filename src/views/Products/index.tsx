import { useState } from "react";
import "./index.css";
import { Product } from "../../type";
import { NumberToVND } from "../../helper";
import { useProducts } from "../../hooks/useProduct";
import { ITEM_PER_ROW } from "../../constant";
import { Pagination } from "antd";
import { Link } from "react-router-dom";

function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, mutate: refreshProducts } = useProducts(currentPage, 10);
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
            <div>{item.nameProduct}</div>
            <div>{NumberToVND.format(item.price)}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination onChange={onPageChange} defaultPageSize={10} total={20} />
      </div>
    </div>
  );
}

export default Products;
