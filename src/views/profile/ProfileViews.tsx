import ProfileForm from "@/components/profile/ProfileForm";
import { useAuth } from "@/hooks/useAuth";

const ProfileViews = () => {
  const { data, isLoading } = useAuth();

  if (isLoading) return "Cargando...";
  if (data) return <ProfileForm data={data} />;
};

export default ProfileViews;
