import { Spin } from "antd";
import { useMe } from "../../hooks/useMe";
import "./index.css";
function Profile() {
  const { data, isLoading } = useMe();
  if (isLoading) return <Spin />;

  if (data?.type === "agent") {
    return <div className="AgentProfile Profile"></div>;
  }

  if (data?.type === "staff") {
    return <div className="StaffProfile Profile"></div>;
  }
}

export default Profile;
