import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./Breadcrumb.css";

const Breadcrumb = ({ categories = [], productName = "" }) => {
  const items = [
    { name: "Anasayfa", path: "/" },
    ...categories.map((cat, idx) => ({
      name: cat,
      path: `/${categories.slice(0, idx + 1).join("/").toLowerCase()}`,
    })),
  ];

  if (productName) {
    items.push({ name: productName });
  }

  return (
    <div className="single-topbar">
      <nav className="breadcrumb" aria-label="breadcrumb">
        <ul>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className={isLast ? "active" : ""}>
                {isLast ? (
                  item.name
                ) : (
                  <Link to={item.path}>{item.name}</Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

Breadcrumb.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  productName: PropTypes.string,
};

Breadcrumb.defaultProps = {
  categories: [],
  productName: "",
};

export default Breadcrumb;
