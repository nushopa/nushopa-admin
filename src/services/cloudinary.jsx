import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const cloudinaryApi = createApi({
  reducerPath: "cloudinaryApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_CLOUDINARY_BASE_URL }),
  endpoints: (builder) => ({
    addImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "h8bgt8bc");

        return {
          url: "/image/upload",
          method: "POST",
          body: formData,
        };
      },
    }),

  }),
});

export const {
  useAddImageMutation, // Updated to useAddImageMutation
} = cloudinaryApi;
