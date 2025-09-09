import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Hammer, PaintBucket, Ruler, Wrench } from "lucide-react";

export function Services() {
  const services = [
    {
      icon: Ruler,
      title: "Дизайн и проектирование",
      description: "Создаем 3D-модели и чертежи будущей мебели с учетом ваших пожеланий и особенностей помещения.",
      features: ["3D-визуализация", "Чертежи", "Подбор материалов", "Расчет стоимости"]
    },
    {
      icon: Hammer,
      title: "Изготовление мебели",
      description: "Производим мебель любой сложности из натурального дерева с использованием традиционных и современных техник.",
      features: ["Столы и стулья", "Шкафы и комоды", "Кровати", "Кухонная мебель"]
    },
    {
      icon: PaintBucket,
      title: "Отделка и покраска",
      description: "Профессиональная обработка поверхностей, покраска и нанесение защитных покрытий для долговечности.",
      features: ["Шлифовка", "Морение", "Лакировка", "Масляные покрытия"]
    },
    {
      icon: Wrench,
      title: "Реставрация",
      description: "Восстанавливаем антикварную мебель и любимые предметы интерьера, возвращая им первоначальный вид.",
      features: ["Ремонт конструкций", "Восстановление покрытий", "Замена фурнитуры", "Консультации"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">Наши услуги</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Полный цикл работ: от идеи до готового изделия
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}