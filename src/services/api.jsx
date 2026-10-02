import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { clearUser } from "../redux/user";

// The access token lives ONLY in the httpOnly cookie set by the backend.
// `credentials: "include"` makes the browser attach it to every request.
const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: "include",
});

const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) api.dispatch(clearUser());
  return result;
};

const paged = ({ page = 1, limit = 15 } = {}) => ({ page, limit });

export const adminApi = createApi({
  reducerPath: "adminApi",
  tagTypes: [
    "Admin",
    "Advert",
    "Product",
    "Customer",
    "Distributor",
    "Market",
    "Newsletter",
    "Driver",
    "Order",
    "Notification",
    "PriceList",
    "Contact",
  ],
  baseQuery,
  endpoints: (builder) => ({
    // ---------- Auth / session ----------
    loginAdmin: builder.mutation({
      query: (data) => ({ url: "login", method: "POST", body: data }),
    }),
    createAdmin: builder.mutation({
      query: (data) => ({ url: "create", method: "POST", body: data }),
    }),
    // NOTE: adjust these URLs to match your customer router.
    verifyRegistrationOTP: builder.mutation({
      query: (data) => ({ url: "verify-otp", method: "POST", body: data }),
    }),
    resendRegistrationOTP: builder.mutation({
      query: (data) => ({ url: "resend-otp", method: "POST", body: data }),
    }),
    getProfile: builder.query({
      query: () => "profile",
      providesTags: ["Admin"],
    }),
    logoutAdmin: builder.mutation({
      query: () => ({ url: "logout", method: "POST" }),
    }),

    // ---------- Products ----------
    singleProduct: builder.query({
      query: (id) => `product/get/${id}`,
      providesTags: ["Product"],
    }),
    relatedProducts: builder.query({
      query: (productCat) => `product?product_cat=${encodeURIComponent(productCat)}`,
      providesTags: ["Product"],
    }),
    getProduct: builder.query({
      query: () => "product",
      providesTags: ["Product"],
    }),
    getProducts: builder.query({
      query: (args) => ({ url: "product", params: paged(args) }),
      providesTags: ["Product"],
    }),
    getProductTotal: builder.query({
      query: () => "product/total",
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation({
      query: (data) => ({ url: "product/add", method: "POST", body: data }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({ url: "product/update", method: "PUT", body: data }),
      invalidatesTags: ["Product"],
    }),
    toggleProductStock: builder.mutation({
      query: ({ id, out_of_stock }) => ({
        url: "product/toggle-stock",
        method: "PATCH",
        body: { id, out_of_stock },
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `product/remove/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product"],
    }),
    getCategory: builder.query({ query: () => "cartegorie/get" }),

    // ---------- Orders ----------
    getOrders: builder.query({
      query: (args) => ({ url: "order", params: paged(args) }),
      providesTags: ["Order"],
    }),
    getOrder: builder.query({
      query: (orderID) => `order/${orderID}`,
      providesTags: ["Order"],
    }),
    getTotalRevenue: builder.query({
      query: () => "order/total/order",
      providesTags: ["Order"],
    }),
    getTotalSold: builder.query({
      query: () => "order/total/sold",
      providesTags: ["Order"],
    }),
    getAssignedDriver: builder.query({
      query: (orderID) => `order/driver/assigned/${orderID}`,
      providesTags: ["Order"],
    }),
    getAssignedDistributor: builder.query({
      query: (orderID) => `order/assigned/${orderID}`,
      providesTags: ["Order"],
    }),
    // Which order (if any) a distributor is currently linked to.
    // Confirm this route exists on your backend.
    getDistributorAssignment: builder.query({
      query: (distributorID) => `order/assigned-distributor/${distributorID}`,
      providesTags: ["Order"],
    }),
    getDistributorOrders: builder.query({
      query: (distributorID) => `order/distributor/${distributorID}`,
      providesTags: ["Order"],
    }),
    updateStatus: builder.mutation({
      query: (data) => ({ url: "order/update", method: "PUT", body: data }),
      invalidatesTags: ["Order"],
    }),
    updateAssign: builder.mutation({
      query: ({ orderID, distributorID }) => ({
        url: "order/assign",
        method: "POST",
        body: { orderID, distributorID },
      }),
      invalidatesTags: ["Order"],
    }),
    // distributorID is optional so both old and new callers work.
    updateUnassign: builder.mutation({
      query: ({ orderID, distributorID }) => ({
        url: "order/unassign",
        method: "POST",
        body: { orderID, distributorID },
      }),
      invalidatesTags: ["Order"],
    }),
    assignDriver: builder.mutation({
      query: ({ orderID, driverID }) => ({
        url: "order/assign-driver",
        method: "PUT",
        body: { orderID, driverID },
      }),
      invalidatesTags: ["Order"],
    }),
    unassignDriver: builder.mutation({
      query: ({ orderID }) => ({
        url: "order/unassign-driver",
        method: "PUT",
        body: { orderID },
      }),
      invalidatesTags: ["Order"],
    }),

    // ---------- Customers ----------
    getCustomer: builder.query({
      query: (args) => ({ url: "customers", params: paged(args) }),
      providesTags: ["Customer"],
    }),
    singleCustomer: builder.query({
      query: (id) => `customers/${id}`,
      providesTags: ["Customer"],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({ url: `customers/${id}`, method: "DELETE" }),
      invalidatesTags: ["Customer", "Distributor"],
    }),

    // ---------- Distributors ----------
    getDistributors: builder.query({
      query: (args) => ({ url: "customers/distributors", params: paged(args) }),
      providesTags: ["Distributor"],
    }),
    getDistributor: builder.query({
      query: (id) => `customers/distributors/${id}`,
      providesTags: ["Distributor"],
    }),
    addDistributors: builder.mutation({
      query: (data) => ({
        url: "create",
        method: "POST",
        body: { ...data, role: 6000 },
      }),
      invalidatesTags: ["Distributor", "Customer"],
    }),
    updateDistributors: builder.mutation({
      query: (data) => ({ url: "update/profile", method: "PUT", body: data }),
      invalidatesTags: ["Distributor", "Customer"],
    }),
    deleteDistributor: builder.mutation({
      query: (id) => ({ url: `customers/${id}`, method: "DELETE" }),
      invalidatesTags: ["Distributor", "Customer"],
    }),
    patchDistributorStatus: builder.mutation({
      query: ({ id, status, reason }) => ({
        url: `customers/distributors/${id}/status`,
        method: "PATCH",
        body: { status, reason },
      }),
      invalidatesTags: ["Distributor"],
    }),

    // ---------- Drivers ----------
    getDrivers: builder.query({
      query: (args) => ({ url: "driver", params: paged(args) }),
      providesTags: ["Driver"],
    }),
    getDriver: builder.query({
      query: (id) => `driver/${id}`,
      providesTags: ["Driver"],
    }),
    setDriverReview: builder.mutation({
      query: ({ id, review }) => ({
        url: `driver/${id}/review`,
        method: "PUT",
        body: { review },
      }),
      invalidatesTags: ["Driver"],
    }),
    deleteDriver: builder.mutation({
      query: (id) => ({ url: `driver/${id}`, method: "DELETE" }),
      invalidatesTags: ["Driver"],
    }),

    // ---------- Markets ----------
    getMarkets: builder.query({
      query: (args) => ({ url: "marketplace/market", params: paged(args) }),
      providesTags: ["Market"],
    }),
    addMarket: builder.mutation({
      query: (data) => ({
        url: "marketplace/add-market",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Market"],
    }),
    updateMarket: builder.mutation({
      query: (data) => ({
        url: "marketplace/market",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Market"],
    }),
    deleteMarket: builder.mutation({
      query: (id) => ({
        url: `marketplace/delete-market/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Market"],
    }),

    // ---------- Price list (cities) ----------
    getPriceList: builder.query({
      query: () => "pricelist",
      providesTags: ["PriceList"],
    }),
    addCity: builder.mutation({
      query: (data) => ({ url: "pricelist/add", method: "POST", body: data }),
      invalidatesTags: ["PriceList"],
    }),
    updateCity: builder.mutation({
      query: (data) => ({ url: "pricelist/edit", method: "PUT", body: data }),
      invalidatesTags: ["PriceList"],
    }),
    deleteCity: builder.mutation({
      query: (id) => ({ url: `pricelist/delete/${id}`, method: "DELETE" }),
      invalidatesTags: ["PriceList"],
    }),

    // ---------- Newsletter ----------
    getNewsletter: builder.query({
      query: (args) => ({ url: "news", params: paged(args) }),
      providesTags: ["Newsletter"],
    }),
    deleteNewsletter: builder.mutation({
      query: (id) => ({ url: `news/${id}`, method: "DELETE" }),
      invalidatesTags: ["Newsletter"],
    }),

    // ---------- Support / contact ----------
    getContacts: builder.query({
      query: (args) => ({ url: "contact", params: paged(args) }),
      providesTags: ["Contact"],
    }),

    // ---------- Notifications ----------
    getNotifications: builder.query({
      query: () => "notification",
      providesTags: ["Notification"],
    }),

    // ---------- Adverts ----------
    getAdverts: builder.query({
      query: () => "adverts",
      providesTags: ["Advert"],
    }),
    uploadAdvert: builder.mutation({
      query: (data) => ({ url: "adverts", method: "POST", body: data }),
      invalidatesTags: ["Advert"],
    }),
    editAdvert: builder.mutation({
      query: ({ id, data }) => ({
        url: `adverts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Advert"],
    }),
    deleteAdvert: builder.mutation({
      query: (id) => ({ url: `adverts/${id}`, method: "DELETE" }),
      invalidatesTags: ["Advert"],
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useCreateAdminMutation,
  useVerifyRegistrationOTPMutation,
  useResendRegistrationOTPMutation,
  useGetProfileQuery,
  useLogoutAdminMutation,
  useSingleProductQuery,
  useRelatedProductsQuery,
  useGetProductQuery,
  useGetProductsQuery,
  useGetProductTotalQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useToggleProductStockMutation,
  useDeleteProductMutation,
  useGetCategoryQuery,
  useGetOrdersQuery,
  useGetOrderQuery,
  useGetTotalRevenueQuery,
  useGetTotalSoldQuery,
  useGetAssignedDriverQuery,
  useGetAssignedDistributorQuery,
  useGetDistributorAssignmentQuery,
  useGetDistributorOrdersQuery,
  useUpdateStatusMutation,
  useUpdateAssignMutation,
  useUpdateUnassignMutation,
  useAssignDriverMutation,
  useUnassignDriverMutation,
  useGetCustomerQuery,
  useSingleCustomerQuery,
  useDeleteCustomerMutation,
  useGetDistributorsQuery,
  useGetDistributorQuery,
  useAddDistributorsMutation,
  useUpdateDistributorsMutation,
  useDeleteDistributorMutation,
  usePatchDistributorStatusMutation,
  useGetDriversQuery,
  useGetDriverQuery,
  useSetDriverReviewMutation,
  useDeleteDriverMutation,
  useGetMarketsQuery,
  useAddMarketMutation,
  useUpdateMarketMutation,
  useDeleteMarketMutation,
  useGetPriceListQuery,
  useAddCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  useGetNewsletterQuery,
  useDeleteNewsletterMutation,
  useGetContactsQuery,
  useGetNotificationsQuery,
  useGetAdvertsQuery,
  useUploadAdvertMutation,
  useEditAdvertMutation,
  useDeleteAdvertMutation,
} = adminApi;