import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Input,
} from "@material-tailwind/react";
import { useEffect, useMemo, useState } from "react";
import { useAddProductMutation } from "../../../services/api";
import { useAddImageMutation } from "../../../services/cloudinary";
import axios from "axios";
import { TextEditorReact } from "../../editor";
import { $generateHtmlFromNodes } from "@lexical/html";

const INITIAL_FORM_DATA = {
  productName: "",
  productBrandName: "",
  productAmount: 0,
  productCostPrice: 0,
  productImage: null,
  productQuantity: 1,
  altImages: [],
};

export function AddProductForm({ handleOpen, open }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState("");
  const [agriculturalData, setAgriculturalData] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [addImage] = useAddImageMutation();
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let baseUrl = import.meta.env.VITE_BASE_URL;

  // Fetch categories and set initial values
  useEffect(() => {
    setCategoriesLoading(true);
    axios
      .get(`${baseUrl}category/get`)
      .then((response) => {
        if (response.data.agriculturalCategories) {
          const categories = response.data.agriculturalCategories;
          setAgriculturalData(categories);

          // Set initial category if data exists
          if (categories.length > 0) {
            setSelectedCategory(categories[0].category); // Default to the first category
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      })
      .finally(() => setCategoriesLoading(false));
  }, [baseUrl]);

  // Memoized subcategories and sub-subcategories based on selection
  const subcategories = useMemo(() => {
    const category = agriculturalData.find(
      (category) => category.category === selectedCategory
    );
    return category?.subcategories || [];
  }, [selectedCategory, agriculturalData]);

  const subsubcategories = useMemo(() => {
    const subcategory = subcategories.find(
      (sub) => sub.name === selectedSubcategory
    );
    return subcategory?.subsubcategories || [];
  }, [selectedSubcategory, subcategories]);

  const handleSelectCategory = (newOption) => {
    setSelectedCategory(newOption);
    setSelectedSubcategory(""); // Reset subcategory
    setSelectedSubSubcategory(""); // Reset sub-subcategory
  };

  const handleSelectSubcategory = (newOption) => {
    setSelectedSubcategory(newOption);
    setSelectedSubSubcategory(""); // Reset sub-subcategory
  };

  const handleSelectSubSubcategory = (newOption) => {
    setSelectedSubSubcategory(newOption);
  };

  const handleEditorChange = (editorState, editor) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor);
      setContent(html);
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "productImage") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
    } else if (name.startsWith("altImage")) {
      const altImageIndex = parseInt(name.replace("altImage", ""), 10) - 1;
      const altImagesCopy = [...formData.altImages];
      altImagesCopy[altImageIndex] = files[0];

      setFormData((prevFormData) => ({
        ...prevFormData,
        altImages: altImagesCopy,
      }));
    } else {
      if (name === "productCostPrice") {
        const costPrice = parseFloat(value);
        const sellingPrice = costPrice * 1.15;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
          productAmount: isNaN(sellingPrice) ? "" : sellingPrice.toFixed(2),
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      }
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setContent("");
    setSelectedSubcategory("");
    setSelectedSubSubcategory("");
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setLoading(true);

    try {
      const costPrice = parseFloat(formData.productCostPrice);
      const sellingPrice = parseFloat(formData.productAmount);

      if (isNaN(costPrice) || isNaN(sellingPrice)) {
        setErrorMessage("Please enter a valid cost price and product amount.");
        setLoading(false);
        return;
      }

      if (sellingPrice <= costPrice) {
        setErrorMessage("Product amount must be greater than product cost price.");
        setLoading(false);
        return;
      }

      if (!formData.productName || !formData.productBrandName) {
        setErrorMessage("Please provide a product name and brand name.");
        setLoading(false);
        return;
      }

      if (!formData.productImage) {
        setErrorMessage("Please select a main image.");
        setLoading(false);
        return;
      }

      // Upload the main image first.
      const mainImageResponse = await addImage(formData.productImage);
      const mainImageUrl = mainImageResponse?.data?.secure_url;

      if (!mainImageUrl) {
        setErrorMessage("Main image upload failed. Please try again.");
        setLoading(false);
        return;
      }

      // Upload any provided alt images, skipping empty slots.
      const altImageUrls = await Promise.all(
        formData.altImages
          .filter(Boolean)
          .map(async (altImage) => {
            const altImageResponse = await addImage(altImage);
            return altImageResponse?.data?.secure_url;
          })
      );

      const postDataInfo = {
        product_name: formData.productName,
        product_brand_name: formData.productBrandName,
        product_image: mainImageUrl,
        product_total: parseInt(formData.productQuantity, 10),
        product_cat: selectedCategory,
        product_sub_cat: selectedSubcategory,
        product_sub_sub_cat: selectedSubSubcategory,
        alt_image: altImageUrls.filter(Boolean),
        product_des: content,
        product_price: parseInt(sellingPrice, 10),
        product_cost_price: costPrice,
        product_rate: 5,
      };

      await addProduct(postDataInfo).unwrap();

      // Reset local state and close + refetch instead of a full page
      // reload, which used to reset pagination/search and reload the
      // entire app.
      resetForm();
      handleOpen(true);
    } catch (error) {
      console.error("Error submitting product:", error);
      setErrorMessage("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        size="lg"
        open={open}
        handler={() => handleOpen(false)}
        className="bg-transparent shadow-none "
      >
        <Card className="mx-auto w-full max-w-full">
          <CardBody className="flex overflow-y-auto h-[30rem] flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Add Product
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
                    className="py-[.65rem] px-4 ps-9 pe-16 block w-ful border-gray-400 border shadow-sm rounded-lg text-sm"
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
                    disabled
                    type="number"
                    size="lg"
                    className="py-[.65rem] px-4 ps-9 pe-16 block w-ful border-gray-400 border shadow-sm rounded-lg text-sm"
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
                className="block w-full border border-gray-400 shadow-sm rounded-lg text-sm file:border-0 file:bg-gray-100 file:me-4 file:py-3 file:px-4"
                name="productImage"
                onChange={handleChange}
              />
            </div>

            <div className="-mb-2 flex gap-3 w-full">
              {/* Category Dropdown */}
              <div className="w-1/3">
                <Typography variant="h6">Add Category</Typography>
                {categoriesLoading ? (
                  <Typography>Loading categories...</Typography>
                ) : (
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
                )}
              </div>

              {/* Subcategory Dropdown */}
              <div className="w-1/3">
                <Typography variant="h6">Choose Subcategory</Typography>
                <select
                  className="w-full border border-gray-400 shadow-sm rounded-lg p-2"
                  value={selectedSubcategory}
                  onChange={(e) => handleSelectSubcategory(e.target.value)}
                  disabled={!subcategories.length}
                >
                  <option value="">Select subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.name} value={subcategory.name}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-Subcategory Dropdown */}
              <div className="w-1/3">
                <Typography variant="h6">Choose Sub-Subcategory</Typography>
                <select
                  className="w-full border border-gray-400 shadow-sm rounded-lg p-2"
                  value={selectedSubSubcategory}
                  onChange={(e) => handleSelectSubSubcategory(e.target.value)}
                  disabled={!subsubcategories.length}
                >
                  <option value="">Select sub-subcategory</option>
                  {subsubcategories.map((subsubcategory) => (
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
                    className="block w-full border border-gray-400 shadow-sm rounded-lg text-sm file:border-0 file:bg-gray-100 file:me-4 file:py-3 file:px-4"
                    name={`altImage${index}`}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
            <div>
              <Typography variant="h6">Add description </Typography>
              <div className="w-full  max-w-3xl mx-auto mt-6 mb-20">
                <TextEditorReact handleEditorChange={handleEditorChange} />
              </div>
            </div>
          </CardBody>
          <Button
            variant="gradient"
            onClick={handleSubmit}
            fullWidth
            disabled={isLoading || loading}
          >
            {isLoading || loading ? "Adding..." : "Add Product"}
          </Button>
        </Card>
      </Dialog>
    </>
  );
}