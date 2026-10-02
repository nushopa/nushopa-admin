import { Card, List } from "@material-tailwind/react";
import DefaultLayout from "../layouts/defaultLayout";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BellSlashIcon } from "@heroicons/react/24/solid";
import NotificationItem from "../components/notification/NotificationItem";

export default function NotificationPage() {
  // HeaderInfo (rendered by the layout) fetches the list with RTK Query and
  // keeps it live over the socket, so this page only reads from the store.
  const notifications = useSelector((state) => state.notifications);

  const sorted = useMemo(
    () =>
      notifications
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [notifications]
  );

  return (
    <DefaultLayout>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold text-mainGreen mb-4">
          Notifications
        </h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Card className="p-6 rounded-lg shadow-lg overflow-hidden bg-white">
              {sorted.length > 0 ? (
                <List>
                  {sorted.map((item, index) => (
                    <NotificationItem key={item._id ?? index} item={item} />
                  ))}
                </List>
              ) : (
                <div className="text-center py-20">
                  <BellSlashIcon className="w-40 mx-auto mb-4" />
                  <p className="text-lg text-gray-500">You’re all caught up!</p>
                  <p className="text-gray-400">No new notifications for now.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}