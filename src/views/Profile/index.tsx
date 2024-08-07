import { useAgentById } from "../../hooks/useAgent";
import { useUserStore } from "../../store/user";
import "./index.css";
function Profile() {
  const roleName = useUserStore((state) => state.roleName);
  const id = useUserStore((state) => state.id);
  const { data } = useAgentById(id);
  console.info(data);

  return <div className="Profile"></div>;
}

export default Profile;
