import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const adminApi = createApi({
  reducerPath: "adminApi",
  tagTypes: ["Admin", "Advert"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const jwt = Cookies.get("jwt");
      if (jwt) {
        headers.set("Authorization", `Bearer ${jwt}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    singleProduct: builder.query({
      query: (id) => `product/get/${id}`,
    }),

    singleCustomer: builder.query({
      query: (id) => `customers/${id}`,
    }),

    relatedProducts: builder.query({
      query: (productCat) => `product?product_cat=${productCat}`,
    }),


    //get product
    getProduct: builder.query({
      query: () => "product",
    }),

    //get product
    getOrders: builder.query({
      query: () => "order",
    }),

    //get product
    getCustomer: builder.query({
      query: () => "customers",
    }),


    // get distributors 
    getDistributors: builder.query({
      query: ({page = 1, limit = 20} = {}) => ({
          url: "customers/distributors",
          params: { page, limit }
      })
    }),

    //get product
    getCategory: builder.query({
      query: () => "cartegorie/get",
    }),

    // update order status
    updateStatus: builder.mutation({
      query: (data) => ({
        url: "order/update",
        method: "PUT",
        body: data,
      }),
    }),

    // add product
    addProduct: builder.mutation({
      query: (data) => ({
        url: "product/add",
        method: "POST",
        body: data,
      }),
    }),

    // add product price
    addCity: builder.mutation({
      query: (data) => ({
        url: "pricelist/add",
        method: "POST",
        body: data,
      }),
    }),


    // add market
    addMarket: builder.mutation({
      query: (data) => ({
        url: "marketplace/add-market",
        method: "POST",
        body: data,
      }),
    }),


    // add product
    addDistributors: builder.mutation({
      query: (data) => ({
        url: "create",
        method: "POST",
        body: {...data, role: 6000},
      }),
    }),


    // delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `product/remove/${id}`,
        method: "DELETE",
      }),
    }),

    // delete product
    deleteDistributor: builder.mutation({
      query: (id) => ({
        url: `customers/${id}`,
        method: "DELETE",
      }),
    }),

    // patchdistributor status
    patchDistributorStatus: builder.mutation({
      query: (id) => ({
        url: `customers/distributors/${id}/status`,
        method: "PATCH",
      }),
    }),


    // delete product
    deleteMarket: builder.mutation({
      query: (id) => ({
        url: `marketplace/delete-market/${id}`,
        method: "DELETE",
      }),
    }),


    // login customer
    loginAdmin: builder.mutation({
      query: (data) => ({
        url: "login",
        method: "POST",
        body: data,
      }),
    }),

    // create Admin
    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data,
      }),
    }),


    // update product
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `product/update`, // Assuming your endpoint for updating a product is like /product/update/:id
        method: "PUT",
        body: data,
      }),
    }),

    // toggle a product's out-of-stock status
    toggleProductStock: builder.mutation({
      query: ({ id, out_of_stock }) => ({
        url: "product/toggle-stock",
        method: "PATCH",
        body: { id, out_of_stock },
      }),
    }),

    // update market
    updateMarket: builder.mutation({
      query: (data) => ({
        url: `marketplace/market`, // Assuming your endpoint for updating a product is like //market/:id
        method: "PUT",
        body: data,
      }),
    }),

    // update distributors
    updateDistributors: builder.mutation({
      query: (data) => ({
        url: `update/profile`, // Assuming your endpoint for updating a product is like //market/:id
        method: "PUT",
        body: data,
      }),
    }),


    updateCity: builder.mutation({
      query: (data) => ({
        url: `pricelist/edit`, // Assuming your endpoint for updating a product is like //market/:id
        method: "PUT",
        body: data,
      }),
    }),

    // delete customer
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `customers/${id}`, // Adjust the endpoint according to your API
        method: "DELETE",
      }),
    }),

    // delete customer
    deleteNewsletter: builder.mutation({
      query: (id) => ({
        url: `news/${id}`, // Adjust the endpoint according to your API
        method: "DELETE",
      }),
    }),

    deleteCity: builder.mutation({
      query: (id) => ({
        url: `pricelist/delete/${id}`, // Adjust the endpoint according to your API
        method: "DELETE",
      }),
    }),
    updateAssign: builder.mutation({
      query: ({ orderID, distributorID }) => ({
        url: "order/assign",
        method: "POST",
        body: { orderID, distributorID },
      }),
    }),
    updateUnassign: builder.mutation({
      query: ({ orderID }) => ({
        url: "order/unassign",
        method: "POST",
        body: { orderID },
      }),
    }),

    getAdverts: builder.query({
      query: () => "adverts",
      providesTags: ["Advert"]
    }),

    uploadAdvert: builder.mutation({
      query:(data) => ({
        url: 'adverts',
        method: "POST",
        body: data,
      }),
      invalidatesTags:["Advert"]
    }),

    editAdvert: builder.mutation({
      query: ({ id, data}) => ({
        url: `adverts/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Advert"],
    }),

    deleteAdvert: builder.mutation({
      query: (id) => ({
        url: `adverts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Advert"]
    })
  }),
});

export const {
  useUpdateStatusMutation,
  useGetProductQuery,
  useSingleCustomerQuery,
  useGetOrdersQuery,
  useUpdateProductMutation,
  useToggleProductStockMutation,
  useDeleteCustomerMutation,
  useSingleProductQuery,
  useRelatedProductsQuery,
  useGetCustomerQuery,
  useGetCategoryQuery,
  useLoginAdminMutation,
  useDeleteProductMutation,
  useAddProductMutation,
  useCreateAdminMutation,
  useAddMarketMutation,
  useAddDistributorsMutation,
  useDeleteDistributorMutation,
  useDeleteMarketMutation,
  useAddCityMutation,
  useUpdateMarketMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  useDeleteNewsletterMutation,
  useUpdateDistributorsMutation,
  useUpdateAssignMutation,
  useUpdateUnassignMutation,
  useGetAdvertsQuery,
  useUploadAdvertMutation,
  useEditAdvertMutation,
  useDeleteAdvertMutation,
  usepatchDistributorStatus,
} = adminApi;