import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export function Gallery() {
  const projects = [
    {
      id: 1,
      title: "Обеденный стол из дуба",
      category: "Столы",
      image: "https://images.unsplash.com/photo-1578625494482-d40f3018683f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBkaW5pbmclMjB0YWJsZSUyMGhhbmRjcmFmdGVkfGVufDF8fHx8MTc1Njg2MjY5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Массивный обеденный стол из цельного дуба на 8 персон"
    },
    {
      id: 2,
      title: "Книжный шкаф",
      category: "Шкафы",
      image: "https://images.unsplash.com/photo-1755870190789-113202c5096c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjB3b29kZW4lMjBib29rc2hlbGYlMjBjYWJpbmV0fGVufDF8fHx8MTc1Njg2MjY5OHww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Встроенный книжный шкаф с регулируемыми полками"
    },
    {
      id: 3,
      title: "Авторское кресло",
      category: "Стулья",
      image: "https://images.unsplash.com/photo-1584114238561-e7417aa7bb11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMHdvb2RlbiUyMGNoYWlyJTIwZnVybml0dXJlfGVufDF8fHx8MTc1Njg2MjcwMXww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Эргономичное кресло ручной работы из ореха"
    },
    {
      id: 4,
      title: "Кухонный остров",
      category: "Кухни",
      image: "https://images.unsplash.com/photo-1709747820806-057272eddd5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBraXRjaGVuJTIwaXNsYW5kJTIwY291bnRlcnRvcHxlbnwxfHx8fDE3NTY4NjI3MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Многофункциональный кухонный остров с местами для хранения"
    },
    {
      id: 5,
      title: "Гардеробная система",
      category: "Шкафы",
      image: "https://images.unsplash.com/photo-1722859183750-fdf609e56b99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjB3YXJkcm9iZSUyMGNsb3NldCUyMGN1c3RvbXxlbnwxfHx8fDE3NTY4NjI3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Индивидуальная гардеробная система с раздвижными дверями"
    },
    {
      id: 6,
      title: "Кровать с изголовьем",
      category: "Спальни",
      image: "https://images.unsplash.com/photo-1723111568816-48c31eca8132?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBiZWQlMjBmcmFtZSUyMGhlYWRib2FyZHxlbnwxfHx8fDE3NTY4NjI3MDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Двуспальная кровать с мягким изголовьем из массива"
    }
  ];

  return (
    <section id="gallery" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">Наши работы</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Каждое изделие уникально и создано с любовью к дереву и вниманием к деталям
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">{project.category}</Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl mb-2">{project.title}</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}