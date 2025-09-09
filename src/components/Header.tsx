import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl text-primary">WoodCraft</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">Главная</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">О нас</a>
            <a href="#gallery" className="text-foreground hover:text-primary transition-colors">Галерея</a>
            <a href="#services" className="text-foreground hover:text-primary transition-colors">Услуги</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">Контакты</a>
          </nav>

          <div className="hidden md:flex">
            <Button onClick={() => alert('Кнопка Заказать нажата!')}>Заказать</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <a href="#home" className="block px-3 py-2 text-foreground hover:text-primary">Главная</a>
              <a href="#about" className="block px-3 py-2 text-foreground hover:text-primary">О нас</a>
              <a href="#gallery" className="block px-3 py-2 text-foreground hover:text-primary">Галерея</a>
              <a href="#services" className="block px-3 py-2 text-foreground hover:text-primary">Услуги</a>
              <a href="#contact" className="block px-3 py-2 text-foreground hover:text-primary">Контакты</a>
              <div className="px-3 py-2">
                <Button className="w-full">Заказать</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}