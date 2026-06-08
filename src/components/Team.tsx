import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users } from 'lucide-react';

const Team = () => {
  const teamMembers = [
    {
      name: 'Allaka Venkateswara Rao',
      role: 'Team Lead / ML Developer',
      initials: 'AVR',
      color: 'bg-gradient-primary',
    },
    {
      name: 'Kaldari Surya Sravanthi',
      role: 'Frontend Developer',
      initials: 'KSS',
      color: 'bg-gradient-gold',
    },
    {
      name: 'Madiki Sindhu',
      role: 'Data Analyst',
      initials: 'MS',
      color: 'bg-gradient-primary',
    },
    {
      name: 'Gurugubella Abhiram',
      role: 'Backend Developer',
      initials: 'GA',
      color: 'bg-gradient-gold',
    },
  ];

  return (
    <section id="team" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our Team</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet The Team</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Dedicated professionals working together to revolutionize travel planning
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-none text-center"
            >
              <CardContent className="p-6">
                <Avatar className={`h-24 w-24 mx-auto mb-4 ${member.color} text-white`}>
                  <AvatarFallback className="text-2xl font-bold bg-transparent">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-2xl mx-auto shadow-card bg-gradient-card border-none">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Project Guide</h3>
            <p className="text-xl font-semibold text-primary">Mr. R. S. V. V. Prasada Rao</p>
            <p className="text-muted-foreground mt-2">Faculty Guide & Mentor</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Team;
