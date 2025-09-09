import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1601811617286-1a57da60328f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b29kJTIwd29ya3Nob3AlMjBmdXJuaXR1cmUlMjBjcmFmdGluZ3xlbnwxfHx8fDE3NTY4NjI2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Мебельная мастерская"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl text-white mb-6">
          Создаем мебель
          <span className="block text-amber-400">вашей мечты</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Индивидуальное изготовление мебели из натурального дерева с заботой о деталях и качестве
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-3">
            Посмотреть работы
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-white/10 border-white text-white hover:bg-white hover:text-black">
            Связаться с нами
          </Button>
        </div>
      </div>
    </section>
  );
}