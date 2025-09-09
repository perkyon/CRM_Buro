import { Separator } from "./ui/separator";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* О компании */}
          <div>
            <h3 className="text-xl mb-4">WoodCraft</h3>
            <p className="text-primary-foreground/80 mb-4">
              Мастерская по изготовлению мебели из натурального дерева. 
              Создаем уникальные изделия с 2009 года.
            </p>
          </div>
          
          {/* Услуги */}
          <div>
            <h3 className="text-lg mb-4">Услуги</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Изготовление мебели</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Дизайн и проектирование</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Реставрация</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Отделка и покраска</a></li>
            </ul>
          </div>
          
          {/* Каталог */}
          <div>
            <h3 className="text-lg mb-4">Каталог</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Столы</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Стулья и кресла</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Шкафы</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Кухонная мебель</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Спальная мебель</a></li>
            </ul>
          </div>
          
          {/* Контакты */}
          <div>
            <h3 className="text-lg mb-4">Контакты</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <p>ул. Мастеров, 15<br />Москва, 123456</p>
              <p>+7 (495) 123-45-67</p>
              <p>info@woodcraft.ru</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 bg-primary-foreground/20" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-primary-foreground/80">
          <p>&copy; 2024 WoodCraft. Все права защищены.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary-foreground transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
}