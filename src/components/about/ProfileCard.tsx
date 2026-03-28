import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TeamMember } from "@/types";
import { GraduationCap, Briefcase, Award, BookOpen, BadgeCheck } from "lucide-react";

interface ProfileCardProps {
  member: TeamMember;
}

interface ProfileSectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
}

function ProfileSection({ icon: Icon, title, items }: ProfileSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand" />
        <h4 className="text-sm font-semibold text-navy">{title}</h4>
      </div>
      <ul className="mt-2 space-y-1 pl-6">
        {items.map((item) => (
          <li key={item} className="text-sm text-muted-foreground list-disc">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProfileCard({ member }: ProfileCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* 좌측: 기본 정보 */}
          <div className="flex flex-col items-center justify-center bg-navy p-8 text-white md:w-64">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-3xl font-bold text-brand">
              {member.name[0]}
            </div>
            <h3 className="mt-4 text-xl font-bold">{member.name}</h3>
            <p className="text-sm text-white/60">{member.position}</p>
          </div>

          {/* 우측: 상세 이력 */}
          <div className="flex-1 space-y-5 p-6 sm:p-8">
            <ProfileSection
              icon={GraduationCap}
              title="학력"
              items={member.education}
            />
            <Separator />
            <ProfileSection
              icon={Briefcase}
              title="경력"
              items={member.career}
            />
            <Separator />
            <ProfileSection
              icon={BadgeCheck}
              title="자격/면허"
              items={member.certifications}
            />
            <Separator />
            <ProfileSection
              icon={Award}
              title="상훈"
              items={member.awards}
            />
            {member.publications && member.publications.length > 0 && (
              <>
                <Separator />
                <ProfileSection
                  icon={BookOpen}
                  title="집필/연구"
                  items={member.publications}
                />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
