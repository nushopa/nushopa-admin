import { NewsletterTable } from "../components/molecule/newsletterTable/newsletterTable";
import DefaultLayout from "../layouts/defaultLayout";

export default function Newsletter() {
  return (
    <DefaultLayout>
      <div className="text-[#212323] pl-10 pt-6 text-xl font-medium font-workSans my-2">
      Newsletter subscriber List
      </div>
      <>
        <NewsletterTable />
      </>
    </DefaultLayout>
  );
}
