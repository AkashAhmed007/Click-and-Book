import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import useRole from "../../../hooks/useRole";
import AdminStatistics from "../Admin/AdminStatistics";

function Statistics() {
  const [role, isLoading] = useRole();
  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  return <>{role === "admin" && <AdminStatistics></AdminStatistics>}</>;
}

export default Statistics;
