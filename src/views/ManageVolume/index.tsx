import "./index.css";
import { notification } from "antd";
import { useUserStore } from "../../store/user";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useVolume } from "../../hooks/useVolume";

function ManageVolume() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data: volume } = useVolume(1);

  return <div className="ManageVolume">{contextHolder}</div>;
}

export default ManageVolume;
