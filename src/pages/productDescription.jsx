import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DefaultLayout from "../layouts/defaultLayout";
import { ImagePlacehoderSkeleton } from "../components/skeleton/imagePlacehoderSkeleton";
import DisplayContent from "../components/molecule/displayContent";
import { AddCommasToNumber, TruncateString } from "../utils/utils";
import {
  useRelatedProductsQuery,
  useSingleProductQuery,
} from "../services/api";

export default function ProductDescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState("");

  const { data, isLoading, isError } = useSingleProductQuery(id);
  const product = data?.product;

  const { data: relatedData } = useRelatedProductsQuery(product?.product_cat, {
    skip: !product?.product_cat,
  });

  const relatedProducts = useMemo(
    () =>
      (relatedData?.products ?? []).filter(
        (p) => p.product_cat === product?.product_cat && p._id !== product?._id
      ),
    [relatedData, product]
  );

  const formattedDate = useMemo(() => {
    if (!product?.createdAt) return "";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(product.createdAt));
  }, [product]);

  if (isError) {
    return (
      <DefaultLayout>
        <div className="py-12 text-center text-red-500 font-semibold">
          Failed to load product.
        </div>
      </DefaultLayout>
    );
  }

  if (isLoading || !product) {
    return (
      <DefaultLayout>
        <div className="py-12">
          <ImagePlacehoderSkeleton />
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="w-[95%] bg-white mx-auto p-6 rounded-lg shadow flex md:flex-row flex-col gap-5">
          {/* Image gallery */}
          <div className="w-full md:w-[65%] grid gap-4 p-6">
            <div>
              <img
                className="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[480px]"
                src={active !== "" ? active : product.product_image}
                alt={product.product_name}
                loading="lazy"
              />
            </div>
            <div className="w-full grid grid-cols-3 gap-4">
              {(product.alt_image ?? []).slice(0, 3).map((alt_img, index) => (
                <div key={index}>
                  <img
                    onClick={() => setActive(alt_img)}
                    src={alt_img}
                    className="w-full h-auto rounded-[10px] cursor-pointer"
                    alt="gallery-image"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product details */}
          <div className="md:w-full p-6 flex flex-col">
            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold text-green-700 capitalize">
                {product.product_name}
              </h1>
              <div className="text-2xl text-gray-900 font-semibold">
                &#8358;{" "}
                <span>{AddCommasToNumber(product.product_price ?? 0)}</span>
              </div>
              {product?.product_brand && (
                <div className="text-gray-700 text-base">
                  Brand:{" "}
                  <span className="text-green-600">{product.product_brand}</span>
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
                <span className="font-medium">{formattedDate}</span>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-bold text-green-700 mb-2">
                Description
              </h2>
              <div className="text-gray-800 text-base leading-relaxed">
                {/* Full HTML is passed through. Slicing HTML at N characters
                    can cut a tag in half and break the markup. */}
                <DisplayContent htmlContent={product.product_des} />
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Related Products
            </h3>
            <div className="flex space-x-6 overflow-x-auto pb-6">
              {relatedProducts.map((item) => (
                <div
                  key={item._id}
                  className="min-w-[220px] bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setActive("");
                    navigate(`/product/${item._id}`);
                  }}
                >
                  <img
                    src={item.product_image}
                    className="w-full h-48 object-cover rounded-t-2xl transition-transform duration-300 hover:scale-105"
                    alt={item.product_name}
                  />
                  <div className="p-4">
                    <div className="text-green-700 font-semibold text-lg">
                      {TruncateString({ str: item.product_name, num: 16 })}
                    </div>
                    <div className="mt-1 text-gray-900 font-medium text-base">
                      &#8358; {AddCommasToNumber(item.product_price ?? 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}