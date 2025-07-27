import { Fragment } from "react";
import Categories from "../components/Categories/Categories";

import Products from "../components/Products/Products";

const HomePage = () => {
  return (
    <Fragment>
      <Categories />
      <Products />
    </Fragment>
  );
};

export default HomePage;
