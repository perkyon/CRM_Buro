import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Award, Users, Clock, Hammer } from "lucide-react";

export function About() {
  const stats = [
    { icon: Award, label: "Лет опыта", value: "15+" },
    { icon: Users, label: "Довольных клиентов", value: "500+" },
    { icon: Clock, label: "Выполненных проектов", value: "1000+" },
    { icon: Hammer, label: "Мастеров", value: "8" },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl mb-6">О нашей мастерской</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Более 15 лет мы создаем уникальную мебель из натурального дерева. 
              Каждое изделие - это результат мастерства, любви к своему делу и 
              внимания к деталям.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Мы используем только качественные материалы и традиционные техники 
              обработки дерева, сочетая их с современными технологиями для создания 
              мебели, которая прослужит поколениям.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-4 text-center">
                      <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1683115099413-5b7d85c2950c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kd29ya2VyJTIwY3JhZnRzbWFuJTIwd29ya3Nob3AlMjB0b29sc3xlbnwxfHx8fDE3NTY4NjI2ODF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Мастер за работой"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}