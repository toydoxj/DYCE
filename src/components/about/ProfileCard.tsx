"use client";

import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TeamMember } from "@/types";
import {
  Briefcase,
  Award,
  BookOpen,
  Users,
} from "lucide-react";

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
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-brand" />
        <h4 className="font-heading text-sm font-bold text-navy">{title}</h4>
      </div>
      <ul className="space-y-1.5 pl-6">
        {items.map((item) => (
          <li key={item} className="list-disc text-sm leading-relaxed text-slate">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProfileCard({ member }: ProfileCardProps) {
  const hasActivities = member.activities && member.activities.length > 0;
  const hasPublications = member.publications && member.publications.length > 0;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col md:flex-row">
        {/* 좌측: 기본 정보 + 사진 */}
        <div className="flex flex-col items-center justify-center bg-navy p-8 text-white md:w-72">
          {member.image ? (
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-white/10">
              <Image
                src={member.image}
                alt={`${member.name} 프로필`}
                fill
                className="object-cover object-top"
              />
            </div>
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/[0.06] font-heading text-3xl font-extrabold text-brand-light">
              {member.name[0]}
            </div>
          )}
          <h3 className="mt-4 font-heading text-xl font-bold">{member.name}</h3>
          <p className="text-sm text-white/50">{member.position}</p>

          <div className="mt-6 w-full space-y-4 border-t border-white/[0.06] pt-6">
            <div>
              <p className="mb-1.5 text-xs font-medium text-white/30">학력</p>
              <ul className="space-y-1">
                {member.education.map((item) => (
                  <li key={item} className="text-xs leading-relaxed text-white/60">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-white/30">자격</p>
              <ul className="space-y-1">
                {member.certifications.map((item) => (
                  <li key={item} className="text-xs leading-relaxed text-white/60">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 우측: 탭 기반 상세 이력 */}
        <div className="flex-1 p-6 sm:p-8">
          <Tabs defaultValue="career">
            <TabsList variant="line" className="mb-6 w-full flex-wrap gap-0">
              <TabsTrigger value="career" className="gap-1 text-xs sm:text-sm">
                <Briefcase className="h-3.5 w-3.5" />
                경력
              </TabsTrigger>
              {hasActivities && (
                <TabsTrigger value="activities" className="gap-1 text-xs sm:text-sm">
                  <Users className="h-3.5 w-3.5" />
                  주요 활동
                </TabsTrigger>
              )}
              <TabsTrigger value="awards" className="gap-1 text-xs sm:text-sm">
                <Award className="h-3.5 w-3.5" />
                상훈
              </TabsTrigger>
              {hasPublications && (
                <TabsTrigger value="publications" className="gap-1 text-xs sm:text-sm">
                  <BookOpen className="h-3.5 w-3.5" />
                  집필/연구
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="career">
              <ProfileSection
                icon={Briefcase}
                title="경력사항"
                items={member.career}
              />
            </TabsContent>

            {hasActivities && (
              <TabsContent value="activities">
                <ProfileSection
                  icon={Users}
                  title="주요 활동"
                  items={member.activities!}
                />
              </TabsContent>
            )}

            <TabsContent value="awards">
              <ProfileSection
                icon={Award}
                title="상훈"
                items={member.awards}
              />
            </TabsContent>

            {hasPublications && (
              <TabsContent value="publications">
                <ProfileSection
                  icon={BookOpen}
                  title="집필 및 연구"
                  items={member.publications!}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
