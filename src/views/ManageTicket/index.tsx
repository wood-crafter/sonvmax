import "./index.css";
import { notification } from "antd";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useUserStore } from "../../store/user";

function ManageTicket() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();

  return <div className="ManageTicket"></div>;
}

export default ManageTicket;
