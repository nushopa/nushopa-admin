import { ProductTable } from "../components/molecule/productTable/productTable";
import DefaultLayout from "../layouts/defaultLayout";

export default function Landing() {
  return (
    <DefaultLayout>
      <div className="text-[#212323] pl-10 pt-6 text-xl font-medium font-workSans my-2">
        Product List
      </div>
      <>
        <ProductTable />
      </>
    </DefaultLayout>
  );
}
