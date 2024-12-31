import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CommunityModule = () => {
  const members = [
    { name: "Sarah K.", role: "Astrologer", avatar: "/placeholder.svg" },
    { name: "Mike R.", role: "Student", avatar: "/placeholder.svg" },
    { name: "Lisa M.", role: "Enthusiast", avatar: "/placeholder.svg" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Community Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((member, index) => (
          <div key={index} className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.split(' ')[0][0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{member.name}</p>
              <p className="text-xs text-primary/60">{member.role}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};