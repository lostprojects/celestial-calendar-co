import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CommunityModule = () => {
  const members = [
    { name: "Sarah K.", role: "Astrologer", avatar: "/placeholder.svg" },
    { name: "Mike R.", role: "Student", avatar: "/placeholder.svg" },
    { name: "Lisa M.", role: "Enthusiast", avatar: "/placeholder.svg" },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#403E43]/10">
      <h3 className="text-lg font-serif text-accent-lightpalm font-bold mb-4">Community Members</h3>
      <div className="space-y-4">
        {members.map((member, index) => (
          <div key={index} className="flex items-center gap-3 bg-white/50 p-3 rounded-xl">
            <Avatar className="h-8 w-8">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.split(' ')[0][0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-dark">{member.name}</p>
              <p className="text-xs text-primary/60 font-mono">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};