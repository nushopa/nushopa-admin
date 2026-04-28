import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DefaultLayout from "../layouts/defaultLayout";
import { ImagePlacehoderSkeleton } from "../components/skeleton/imagePlacehoderSkeleton";
import DisplayContent from "../components/molecule/displayContent";
import axios from "axios";

export default function ProductDescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [formattedDateWithSuffix, setFormattedDateWithSuffix] = useState("");
  const [active, setActive] = useState("");
  const [products, setProducts] = useState({});

  const userId = localStorage.getItem("userId");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    axios
      .get(`${baseUrl}product/get/${id}`)
      .then((response) => {
        if (response.data) {
          setProducts(response.data);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [baseUrl, id, userId]);

  let product = products?.product;

  useEffect(() => {
    if (product) {
      axios
        .get(`${baseUrl}product?product_cat=${product.product_cat}`)
        .then((response) => {
          if (response.data) {
            setRelatedProduct(response.data.products);
          }
        });
    }
  }, [baseUrl, product]);

  useEffect(() => {
    if (product && !isLoading) {
      const date = new Date(product.createdAt);
      const options = { year: "numeric", month: "short", day: "numeric" };
      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date
      );
      setFormattedDateWithSuffix(formattedDate);

      if (relatedProduct?.length) {
        // Filter related products by matching product category
        setRelatedProducts(
          relatedProduct.filter(
            (prod) => prod.product_cat === product.product_cat
          )
        );
      }
    }
  }, [product, isLoading, relatedProduct]);

  function AddCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function Truncate({ str, num }) {
    if (!str) return str;
    return str.length <= num ? str : <>{str.slice(0, num)}...</>;
  }

  const handleClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <DefaultLayout>
      {product && !isLoading && Object.keys(product).length !== 0 ? (
        <div className="py-12 bg-gray-50 min-h-screen">
          <div className="w-[95%] bg-white mx-auto p-6 rounded-lg shadow flex md:flex-row flex-col gap-5">
            {/* Image Gallery using Provided Snippet */}
            <div className="w-full md:w-[65%] grid gap-4 p-6">
              <div className="">
                <img
                  className="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[480px]"
                  src={active !== "" ? active : product.product_image}
                  alt={product.product_name}
                  loading="lazy"
                />
              </div>
              <div className="w-full grid grid-cols-3 gap-4">
                {product.alt_image.slice(0, 3).map((alt_img, index) => (
                  <div key={index}>
                    <img
                      onClick={() => setActive(alt_img)}
                      src={alt_img}
                      className="w-full h-auto rounded-[10px]"
                      alt="gallery-image"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Product Details */}
            <div className="md:w-full p-6 flex flex-col ">
              <div className="space-y-4">
                <h1 className="text-3xl font-extrabold text-green-700 capitalize">
                  {product.product_name}
                </h1>
                <div className="text-2xl text-gray-900 font-semibold">
                  &#8358;{" "}
                  <span>{AddCommasToNumber(product.product_price)}</span>
                </div>
                {product?.product_brand && (
                  <div className="text-gray-700 text-base">
                    Brand:{" "}
                    <a href="#" className="text-green-600 hover:underline">
                      {product.product_brand}
                    </a>
                  </div>
                )}
                <div className="text-gray-700 text-lg">
                  Posted by: <span className="font-medium">Nushopa</span>
                </div>
                <div className="text-gray-700 text-lg">
                  Location: <span className="font-medium">Lagos State</span>
                </div>
                <div className="text-gray-700 text-lg">
                  Available Quantity:{" "}
                  <span className="font-medium">
                    {product.product_total} unit
                  </span>
                </div>
                <div className="text-gray-700 text-lg">
                  Posted Date:{" "}
                  <span className="font-medium">{formattedDateWithSuffix}</span>
                </div>
              </div>
              <div className="mt-6">
                <h2 className="text-xl font-bold text-green-700 mb-2">
                  Description
                </h2>
                <div className="text-gray-800 text-base leading-relaxed">
                  <DisplayContent
                    htmlContent={Truncate({
                      str: product.product_des,
                      num: 500,
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="max-w-6xl mx-auto mt-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Related Products
              </h3>
              <div className="flex space-x-6 overflow-x-auto pb-6">
                {relatedProducts.map((data, index) => (
                  <div
                    key={index}
                    className="min-w-[220px] bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleClick(data._id)}
                  >
                    <img
                      src={data.product_image}
                      className="w-full h-48 object-cover rounded-t-2xl transition-transform duration-300 hover:scale-105"
                      alt={data.product_name}
                    />
                    <div className="p-4">
                      <div className="text-green-700 font-semibold text-lg">
                        {Truncate({ str: data.product_name, num: 16 })}
                      </div>
                      <div className="mt-1 text-gray-900 font-medium text-base">
                        &#8358; {AddCommasToNumber(data.product_price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12">
          <ImagePlacehoderSkeleton />
        </div>
      )}
    </DefaultLayout>
  );
}
