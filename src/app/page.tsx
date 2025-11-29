
import { EducationDisplay } from "@/components/HomePage/EducationComponents/EducationData";
import ProfileDisplay from "@/components/HomePage/ProfileComponents/ProfileData";
import { ExperienceDisplay } from "@/components/HomePage/ExperienceComponents/ExperienceData";
import LoginButton from "@/components/LoginLogoutButton";

export default function Home() {
  return (
    <main className="flex flex-col p-4 max-w-7xl mx-auto">
      <div className="mb=4">
        <ProfileDisplay/>
      </div>
      <div className="mb=4">
        <EducationDisplay/>
      </div>
      <div className="mb=4">
        <ExperienceDisplay/>
      </div>
    </main>
  );
}