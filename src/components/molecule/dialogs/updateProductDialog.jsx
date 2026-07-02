import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Input,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  // useSingleProductQuery,
  useUpdateProductMutation,
} from "../../../services/api";
import { useAddImageMutation } from "../../../services/cloudinary";
import axios from "axios";
import { TextEditorReact } from "../../editor";
import { $generateHtmlFromNodes } from "@lexical/html";

export function UpdateProductForm({ handleOpen, open, productId }) {
  const [agriculturalData, setAgriculturalData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState("");
  const [formData, setFormData] = useState({
    productName: "",
    productBrandName: "",
    productAmount: 0,
    productCostPrice: 0,
    productImage: null,
    productQuantity: 0,
    altImages: [],
  });
  const [addImage] = useAddImageMutation();
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // Track a local preview URL so the user gets visual confirmation their
  // new image was picked (helps diagnose "did my picture actually change" issues).
  const [imagePreview, setImagePreview] = useState(null);

  const handleEditorChange = (editorState, editor) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor);
      setContent(html);
    });
  };

  let baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    axios
      .get(`${baseUrl}category/get`)
      .then((response) => {
        if (response.data.agriculturalCategories) {
          setAgriculturalData(response?.data?.agriculturalCategories);
        }
      })
      .catch((error) => {
        console.error("Error fetching product", error);
      });
  }, [baseUrl]);

  useEffect(() => {
    if (productId) {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}product/get/${productId}`)
        .then((response) => {
          if (response) {
            let product = response.data.product;
            setSelectedCategory(product.product_cat);
            setSelectedSubcategory(product.product_sub_cat);
            setSelectedSubSubcategory(product.product_sub_sub_cat);
            setContent(product.product_des);
            setFormData({
              productName: product.product_name,
              productBrandName: product.product_brand_name,
              productAmount: product.product_price,
              productCostPrice: product.product_cost_price,
              productQuantity: product.product_total,
              altImages: [],
              productImage: null,
            });
            setImagePreview(null);
            setErrorMessage("");
          }
        })
        .catch((error) => {
          console.error("Error fetching address book:", error);
        });
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "productImage") {
      const file = files[0] || null;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: file,
      }));
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else if (name.startsWith("altImage")) {
      const altImageIndex = parseInt(name.replace("altImage", ""), 10) - 1;
      const altImagesCopy = [...formData.altImages];
      altImagesCopy[altImageIndex] = files[0] || null; // Use null if no file is selected

      setFormData((prevFormData) => ({
        ...prevFormData,
        altImages: altImagesCopy,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSelectCategory = (newOption) => {
    setSelectedCategory(newOption);
    setSelectedSubcategory(""); // Reset subcategory when changing category
    setSelectedSubSubcategory(""); // Reset subsubcategory when changing category
  };

  const handleSelectSubcategory = (newOption) => {
    setSelectedSubcategory(newOption);
    setSelectedSubSubcategory(""); // Reset subsubcategory when changing subcategory
  };

  const handleSelectSubSubcategory = (newOption) => {
    setSelectedSubSubcategory(newOption);
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    try {
      let mainImageUrl = null;
      let altImageUrls = [];

      // Upload the replacement main image, if one was chosen. This is the
      // step that previously silently failed to reflect in the update —
      // if the upload succeeded but returned no secure_url, the code
      // would fall through and never set product_image, so the old image
      // stayed in place with no error shown to the user.
      if (formData.productImage) {
        const mainImageResponse = await addImage(formData.productImage);
        mainImageUrl = mainImageResponse?.data?.secure_url;

        if (!mainImageUrl) {
          setErrorMessage("Main image upload failed. Please try again.");
          return;
        }
      }

      // Upload alt images to Cloudinary if they are selected
      if (formData.altImages.length > 0) {
        altImageUrls = await Promise.all(
          formData.altImages.map(async (altImage) => {
            if (altImage) {
              const altImageResponse = await addImage(altImage);
              return altImageResponse?.data?.secure_url;
            }
            return null;
          })
        );
      }

      const updateDataInfo = {
        id: productId, // Provide the product ID for the update
      };

      // Add fields to updateDataInfo only if they are changed
      if (formData.productName) {
        updateDataInfo.product_name = formData.productName;
      }

      if (formData.productBrandName) {
        updateDataInfo.product_brand_name = formData.productBrandName;
      }

      // Use the freshly uploaded image URL. This is set from the
      // addImage() call above, so it always reflects the newly chosen
      // file rather than a stale/undefined reference.
      if (mainImageUrl) {
        updateDataInfo.product_image = mainImageUrl;
      }

      if (formData.productQuantity !== "" && formData.productQuantity !== null && formData.productQuantity !== undefined) {
        updateDataInfo.product_total = parseInt(formData.productQuantity, 10);
      }

      if (selectedCategory) {
        updateDataInfo.product_cat = selectedCategory;
      }

      if (selectedSubcategory) {
        updateDataInfo.product_sub_cat = selectedSubcategory;
      }

      if (selectedSubSubcategory) {
        updateDataInfo.product_sub_sub_cat = selectedSubSubcategory;
      }

      const filteredAltUrls = altImageUrls.filter((url) => url !== null);
      if (filteredAltUrls.length > 0) {
        updateDataInfo.alt_image = filteredAltUrls;
      }

      if (content) {
        updateDataInfo.product_des = content;
      }

      if (formData.productAmount !== "" && formData.productAmount !== null && formData.productAmount !== undefined) {
        updateDataInfo.product_price = parseFloat(formData.productAmount);
      }
      if (formData.productCostPrice !== "" && formData.productCostPrice !== null && formData.productCostPrice !== undefined) {
        updateDataInfo.product_cost_price = parseFloat(formData.productCostPrice);
      }

      updateDataInfo.product_rate = 5;

      // Update the product
      await updateProduct(updateDataInfo).unwrap();

      // Close the dialog and tell the parent to refetch the current page
      // in place, instead of doing a full window.location.reload(),
      // which used to reset pagination and search state back to page 1.
      setImagePreview(null);
      handleOpen(true);
    } catch (error) {
      console.error("Error submitting product:", error);
      setErrorMessage("Failed to update product. Please try again.");
    }
  };

  return (
    <>
      <Dialog
        size="lg"
        open={open}
        handler={() => handleOpen(false)}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-full">
          <CardBody className="flex overflow-y-auto h-[30rem] flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Update Product
            </Typography>

            {errorMessage && (
              <Typography variant="small" color="red">
                {errorMessage}
              </Typography>
            )}

            <div className="-mb-2 flex gap-3 w-full">
              <div className="w-1/2">
                <Typography variant="h6">Product Name</Typography>
                <Input
                  label="Name"
                  size="lg"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/2">
                <Typography variant="h6">Brand Name</Typography>
                <Input
                  label="Brand Name"
                  size="lg"
                  name="productBrandName"
                  value={formData.productBrandName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="-mb-2 flex gap-3 w-full">
              <div className="w-1/3">
                <Typography variant="h6">Product cost price</Typography>
                <div className="relative">
                  <Input
                    type="number"
                    size="lg"
                    className="py-[.65rem] px-4 ps-9 pe-16 block w-ful border-gray-400 border shadow-sm rounded-lg text-sm "
                    placeholder="0.00"
                    name="productCostPrice"
                    value={formData.productCostPrice}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                    <span className="text-gray-500">&#8358;</span>
                  </div>
                  <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-4">
                    <span className="text-gray-500">NGN</span>
                  </div>
                </div>
              </div>
              <div className="w-1/3">
                <Typography variant="h6">Product Amount</Typography>
                <div className="relative">
                  <Input
                    type="number"
                    size="lg"
                    className="py-[.65rem] px-4 ps-9 pe-16 block w-ful border-gray-400 border shadow-sm rounded-lg text-sm "
                    placeholder="0.00"
                    name="productAmount"
                    value={formData.productAmount}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                    <span className="text-gray-500">&#8358;</span>
                  </div>
                  <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-4">
                    <span className="text-gray-500">NGN</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3">
                <Typography variant="h6">Total Quantity</Typography>
                <Input
                  type="number"
                  label="Quantity"
                  size="lg"
                  name="productQuantity"
                  value={formData.productQuantity}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="-mb-2">
              <Typography variant="h6">Product Image</Typography>
              <label htmlFor="file-input-medium" className="sr-only">
                Choose file
              </label>
              <input
                type="file"
                id="file-input-medium"
                className="block w-full border border-gray-400 shadow-sm rounded-lg text-sm file:border-0
                      file:bg-gray-100 file:me-4
                      file:py-3 file:px-4
                  "
                name="productImage"
                onChange={handleChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="New product preview"
                  className="mt-2 h-24 w-24 object-cover rounded-lg border border-gray-300"
                />
              )}
            </div>
            <div className="my-2 flex gap-3 w-full">
              <div className="w-full md:w-1/3">
                <Typography variant="h6">Add category</Typography>
                <select
                  className="w-full border border-gray-400 shadow-sm rounded-lg p-2"
                  value={selectedCategory}
                  onChange={(e) => handleSelectCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  {agriculturalData.map((category) => (
                    <option key={category.category} value={category.category}>
                      {category.category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-1/3">
                <Typography variant="h6">Choose subcategory</Typography>
                <select
                  className="w-full border border-gray-400 shadow-sm rounded-lg p-2"
                  value={selectedSubcategory}
                  onChange={(e) => handleSelectSubcategory(e.target.value)}
                  disabled={!selectedCategory}
                >
                  <option value="">Select subcategory</option>
                  {selectedCategory &&
                    agriculturalData
                      .find((category) => category.category === selectedCategory)
                      ?.subcategories.map((subcategory) => (
                        <option key={subcategory.name} value={subcategory.name}>
                          {subcategory.name}
                        </option>
                      ))}
                </select>
              </div>
              <div className="w-full md:w-1/3">
                <Typography variant="h6">Add subsubcategory</Typography>
                <select
                  className="w-full border border-gray-400 shadow-sm rounded-lg p-2"
                  value={selectedSubSubcategory}
                  onChange={(e) => handleSelectSubSubcategory(e.target.value)}
                  disabled={!selectedSubcategory}
                >
                  <option value="">Select subsubcategory</option>
                  {selectedSubcategory &&
                    agriculturalData
                      .find((category) => category.category === selectedCategory)
                      ?.subcategories.find(
                        (subcategory) => subcategory.name === selectedSubcategory
                      )
                      ?.subsubcategories.map((subsubcategory) => (
                        <option key={subsubcategory} value={subsubcategory}>
                          {subsubcategory}
                        </option>
                      ))}
                </select>
              </div>
            </div>

            <div className="-mb-2 flex gap-3 w-full">
              {[1, 2, 3].map((index) => (
                <div key={index} className="w-full md:w-2/3">
                  <Typography variant="h6">{`Alt Image${index}`}</Typography>
                  <label
                    htmlFor={`alt-file-input-${index}`}
                    className="sr-only"
                  >
                    Choose file
                  </label>
                  <input
                    type="file"
                    id={`alt-file-input-${index}`}
                    className="block w-full border border-gray-400 shadow-sm rounded-lg text-sm file:border-0
                  file:bg-gray-100 file:me-4
                  file:py-3 file:px-4
                "
                    name={`altImage${index}`}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
            <div>
              <Typography variant="h6">Add description </Typography>
              <div className="w-full max-w-3xl mx-auto mt-6 mb-20">
                <TextEditorReact handleEditorChange={handleEditorChange} />
              </div>
            </div>
          </CardBody>
          <Button
            variant="gradient"
            onClick={handleSubmit}
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Product"}
          </Button>
        </Card>
      </Dialog>
    </>
  );
}