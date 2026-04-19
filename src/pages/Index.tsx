import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const GALLERY_IMAGES = [
  {
    src: "https://cdn.poehali.dev/projects/9be08719-4afb-4d38-8e11-9d291b6cad41/files/52d6db63-19c0-4145-950d-303dfb0baeb6.jpg",
    label: "Белый глянец",
  },
  {
    src: "https://cdn.poehali.dev/projects/9be08719-4afb-4d38-8e11-9d291b6cad41/files/38bd3336-99fd-4e07-b13b-c4e66eabe406.jpg",
    label: "Зеркальные двери",
  },
  {
    src: "https://cdn.poehali.dev/projects/9be08719-4afb-4d38-8e11-9d291b6cad41/files/88b7fbeb-4cd1-41ce-806b-7d1b072de879.jpg",
    label: "Умное наполнение",
  },
];

const ADVANTAGES = [
  { icon: "Ruler", title: "Любые размеры", desc: "Шкаф точно по вашему проёму — от 60 до 600 см" },
  { icon: "Palette", title: "500+ материалов", desc: "Плёнки, шпон, стекло, зеркало, пескоструй" },
  { icon: "Clock", title: "Срок от 7 дней", desc: "Замер, производство и установка под ключ" },
  { icon: "ShieldCheck", title: "Гарантия 5 лет", desc: "На корпус, фурнитуру и механизмы" },
  { icon: "Wrench", title: "Собственный монтаж", desc: "Профессиональные сборщики, без субподряда" },
  { icon: "BadgePercent", title: "Цена без наценок", desc: "Производство напрямую — никаких посредников" },
];

const REVIEWS = [
  {
    name: "Анна К.",
    city: "Москва",
    rating: 5,
    text: "Заказала шкаф в спальню, ширина нестандартная — 2,4 метра. Сделали ровно в срок, всё идеально подошло. Менеджер помогла с выбором фасадов — очень довольна!",
    avatar: "А",
  },
  {
    name: "Сергей М.",
    city: "Санкт-Петербург",
    rating: 5,
    text: "Брали шкаф с зеркалами и подсветкой. Качество сборки отличное, фурнитура ходит плавно. Рекомендую всем, кто хочет получить нормальный продукт за адекватные деньги.",
    avatar: "С",
  },
  {
    name: "Елена Р.",
    city: "Казань",
    rating: 5,
    text: "Уже второй шкаф заказываем в этой компании. Первый стоит 4 года — ни одной поломки. Цены честные, замерщик пришёл вовремя, установили аккуратно.",
    avatar: "Е",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function AnimSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Calculator() {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(240);
  const [doors, setDoors] = useState(2);
  const [filling, setFilling] = useState<string[]>([]);
  const [doorType, setDoorType] = useState("ldsp");

  const DOOR_PRICES: Record<string, number> = {
    ldsp: 0,
    mirror: 4500,
    glass: 6000,
    rattan: 5500,
  };
  const FILL_PRICES: Record<string, number> = {
    shelves: 1200,
    drawers: 2800,
    pants: 1800,
    led: 2200,
    safe: 3500,
  };

  const basePrice = Math.round((width / 100) * (height / 100) * 14800);
  const doorExtra = doors * DOOR_PRICES[doorType];
  const fillExtra = filling.reduce((s, k) => s + FILL_PRICES[k], 0);
  const total = basePrice + doorExtra + fillExtra;

  const toggleFill = (key: string) =>
    setFilling((prev) => prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]);

  return (
    <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 md:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-body text-[#999] mb-2 uppercase tracking-widest">Ширина: <span className="text-[#e8c84a] font-semibold">{width} см</span></label>
            <input
              type="range" min={60} max={600} step={10} value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full accent-[#e8c84a] h-2 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[#555] mt-1 font-body">
              <span>60 см</span><span>600 см</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-body text-[#999] mb-2 uppercase tracking-widest">Высота: <span className="text-[#e8c84a] font-semibold">{height} см</span></label>
            <input
              type="range" min={180} max={290} step={5} value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-[#e8c84a] h-2 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[#555] mt-1 font-body">
              <span>180 см</span><span>290 см</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-body text-[#999] mb-3 uppercase tracking-widest">Количество дверей</label>
            <div className="flex gap-2">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setDoors(n)}
                  className={`flex-1 py-2.5 rounded-xl font-display text-lg font-semibold transition-all ${doors === n ? "bg-[#e8c84a] text-black" : "bg-[#1a1a1a] text-[#888] hover:bg-[#222]"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-body text-[#999] mb-3 uppercase tracking-widest">Тип дверей</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "ldsp", label: "ЛДСП", price: "базовый" },
                { key: "mirror", label: "Зеркало", price: "+4 500 ₽/дверь" },
                { key: "glass", label: "Стекло", price: "+6 000 ₽/дверь" },
                { key: "rattan", label: "Ротанг", price: "+5 500 ₽/дверь" },
              ].map(({ key, label, price }) => (
                <button
                  key={key}
                  onClick={() => setDoorType(key)}
                  className={`p-3 rounded-xl text-left transition-all border ${doorType === key ? "border-[#e8c84a] bg-[#e8c84a]/10" : "border-[#2a2a2a] hover:border-[#444]"}`}
                >
                  <div className={`text-sm font-semibold font-body ${doorType === key ? "text-[#e8c84a]" : "text-white"}`}>{label}</div>
                  <div className="text-xs text-[#666] font-body mt-0.5">{price}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-body text-[#999] mb-3 uppercase tracking-widest">Наполнение</label>
            <div className="space-y-2">
              {[
                { key: "shelves", label: "Дополнительные полки", icon: "AlignJustify", price: "+1 200 ₽" },
                { key: "drawers", label: "Выдвижные ящики", icon: "Package", price: "+2 800 ₽" },
                { key: "pants", label: "Штанга и вешалки", icon: "Shirt", price: "+1 800 ₽" },
                { key: "led", label: "LED-подсветка", icon: "Lightbulb", price: "+2 200 ₽" },
                { key: "safe", label: "Встроенный сейф", icon: "Lock", price: "+3 500 ₽" },
              ].map(({ key, label, icon, price }) => (
                <button
                  key={key}
                  onClick={() => toggleFill(key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${filling.includes(key) ? "border-[#e8c84a] bg-[#e8c84a]/10" : "border-[#2a2a2a] hover:border-[#444]"}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${filling.includes(key) ? "bg-[#e8c84a] text-black" : "bg-[#1a1a1a] text-[#666]"}`}>
                    <Icon name={icon} size={16} />
                  </div>
                  <span className={`text-sm font-body flex-1 text-left ${filling.includes(key) ? "text-white" : "text-[#888]"}`}>{label}</span>
                  <span className="text-xs text-[#555] font-body">{price}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#e8c84a]/20 to-[#f0a030]/10 border border-[#e8c84a]/30 rounded-2xl p-5">
            <div className="text-sm text-[#999] font-body mb-1 uppercase tracking-widest">Итоговая стоимость</div>
            <div className="text-5xl font-display font-bold text-[#e8c84a] tracking-tight">
              {total.toLocaleString("ru-RU")} ₽
            </div>
            <div className="text-xs text-[#666] font-body mt-2">Точная цена — после бесплатного замера</div>

            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-sm font-body">
                <span className="text-[#777]">Базовая стоимость</span>
                <span className="text-[#aaa]">{basePrice.toLocaleString("ru-RU")} ₽</span>
              </div>
              {doorExtra > 0 && (
                <div className="flex justify-between text-sm font-body">
                  <span className="text-[#777]">Двери ({doors} шт.)</span>
                  <span className="text-[#aaa]">+{doorExtra.toLocaleString("ru-RU")} ₽</span>
                </div>
              )}
              {fillExtra > 0 && (
                <div className="flex justify-between text-sm font-body">
                  <span className="text-[#777]">Наполнение</span>
                  <span className="text-[#aaa]">+{fillExtra.toLocaleString("ru-RU")} ₽</span>
                </div>
              )}
            </div>

            <button className="mt-5 w-full py-4 bg-[#e8c84a] hover:bg-[#f0d060] text-black font-display font-semibold text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
              Заказать замер бесплатно
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [activeGallery, setActiveGallery] = useState(0);
  const [formData, setFormData] = useState({ name: "", phone: "", comment: "" });
  const [submitted, setSubmitted] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-body overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/90 backdrop-blur-sm border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-display font-bold text-xl tracking-widest text-white">
            КУПЕ<span className="text-[#e8c84a]">МАСТЕР</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#888] font-body">
            {[["Преимущества","advantages"],["Галерея","gallery"],["Отзывы","reviews"],["Контакты","contacts"]].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} className="hover:text-[#e8c84a] transition-colors">{label}</button>
            ))}
          </div>
          <button
            onClick={() => scrollTo("calc")}
            className="px-5 py-2 bg-[#e8c84a] text-black font-display font-semibold text-sm rounded-xl hover:bg-[#f0d060] transition-all"
          >
            Рассчитать цену
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#e8c84a]/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#f0a030]/8 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle, #e8c84a 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8c84a]/30 bg-[#e8c84a]/10 text-[#e8c84a] text-sm font-body mb-6"
              style={{ animation: "fade-up 0.6s ease forwards" }}
            >
              <Icon name="Sparkles" size={14} />
              Производство в Москве · Гарантия 5 лет
            </div>

            <h1
              className="font-display font-bold text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6 uppercase"
              style={{ animation: "fade-up 0.7s ease 0.1s forwards", opacity: 0 }}
            >
              ШКАФЫ<br />
              <span className="text-[#e8c84a]">-КУПЕ</span><br />
              НА ЗАКАЗ
            </h1>

            <p
              className="text-[#888] text-lg max-w-md leading-relaxed mb-8 font-body"
              style={{ animation: "fade-up 0.7s ease 0.2s forwards", opacity: 0 }}
            >
              Изготавливаем шкафы-купе точно по вашим размерам. Замер, производство и установка под ключ от 7 дней.
            </p>

            <div
              className="flex flex-wrap gap-4"
              style={{ animation: "fade-up 0.7s ease 0.3s forwards", opacity: 0 }}
            >
              <button
                onClick={() => scrollTo("calc")}
                className="flex items-center gap-2 px-8 py-4 bg-[#e8c84a] text-black font-display font-semibold text-lg rounded-2xl hover:bg-[#f0d060] transition-all hover:scale-105 active:scale-95"
              >
                <Icon name="Calculator" size={20} />
                Рассчитать стоимость
              </button>
              <button
                onClick={() => scrollTo("gallery")}
                className="flex items-center gap-2 px-8 py-4 border border-[#333] text-white font-display font-semibold text-lg rounded-2xl hover:border-[#e8c84a]/50 hover:text-[#e8c84a] transition-all"
              >
                Посмотреть работы
              </button>
            </div>

            <div
              className="flex gap-8 mt-12 pt-8 border-t border-[#1a1a1a]"
              style={{ animation: "fade-up 0.7s ease 0.4s forwards", opacity: 0 }}
            >
              {[["500+", "Проектов выполнено"], ["7", "Дней от замера"], ["5", "Лет гарантии"]].map(([num, label]) => (
                <div key={num}>
                  <div className="font-display font-bold text-3xl text-[#e8c84a]">{num}</div>
                  <div className="text-sm text-[#666] font-body mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative"
            style={{ animation: "scale-in 0.8s ease 0.3s forwards", opacity: 0 }}
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5]">
              <img
                src={GALLERY_IMAGES[0].src}
                alt="Шкаф-купе"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-[#0f0f0f]/80 backdrop-blur-sm rounded-2xl p-4 border border-[#2a2a2a]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#666] font-body uppercase tracking-widest">Стоимость от</div>
                      <div className="font-display font-bold text-2xl text-[#e8c84a]">29 800 ₽</div>
                    </div>
                    <button
                      onClick={() => scrollTo("contacts")}
                      className="px-4 py-2 bg-[#e8c84a] text-black text-sm font-display font-semibold rounded-xl hover:bg-[#f0d060] transition-all"
                    >
                      Заказать
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-[#e8c84a]/10 border border-[#e8c84a]/20 flex flex-col items-center justify-center">
              <div className="font-display font-bold text-2xl text-[#e8c84a]">7</div>
              <div className="text-[10px] text-[#888] font-body text-center leading-tight">дней<br />срок</div>
            </div>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section id="advantages" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <AnimSection>
            <div className="text-center mb-16">
              <div className="inline-block text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-4">Почему выбирают нас</div>
              <h2 className="font-display font-bold text-5xl md:text-6xl uppercase text-white">НАШИ<br /><span className="text-[#e8c84a]">ПРЕИМУЩЕСТВА</span></h2>
            </div>
          </AnimSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADVANTAGES.map(({ icon, title, desc }, i) => (
              <AnimSection key={i} delay={i * 80}>
                <div className="group p-6 rounded-2xl border border-[#1a1a1a] hover:border-[#e8c84a]/30 bg-[#0a0a0a] hover:bg-[#0f0f0f] transition-all cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-[#e8c84a]/10 flex items-center justify-center mb-4 group-hover:bg-[#e8c84a]/20 transition-all">
                    <Icon name={icon} size={22} className="text-[#e8c84a]" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-white mb-2">{title}</h3>
                  <p className="text-[#666] text-sm font-body leading-relaxed">{desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4">
          <AnimSection>
            <div className="text-center mb-16">
              <div className="inline-block text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-4">Примеры работ</div>
              <h2 className="font-display font-bold text-5xl md:text-6xl uppercase">НАШИ<br /><span className="text-[#e8c84a]">РАБОТЫ</span></h2>
            </div>
          </AnimSection>

          <AnimSection>
            <div className="flex gap-2 justify-center mb-8">
              {GALLERY_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveGallery(i)}
                  className={`px-5 py-2 rounded-xl font-body text-sm transition-all ${activeGallery === i ? "bg-[#e8c84a] text-black font-semibold" : "bg-[#1a1a1a] text-[#888] hover:bg-[#222]"}`}
                >
                  {img.label}
                </button>
              ))}
            </div>

            <div className="relative rounded-3xl overflow-hidden aspect-video">
              <img
                key={activeGallery}
                src={GALLERY_IMAGES[activeGallery].src}
                alt={GALLERY_IMAGES[activeGallery].label}
                className="w-full h-full object-cover"
                style={{ animation: "fade-in 0.4s ease" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/50 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="font-display font-bold text-3xl text-white">{GALLERY_IMAGES[activeGallery].label}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              {GALLERY_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveGallery(i)}
                  className={`rounded-2xl overflow-hidden aspect-video transition-all ${activeGallery === i ? "ring-2 ring-[#e8c84a]" : "opacity-50 hover:opacity-80"}`}
                >
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </AnimSection>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calc" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <AnimSection>
            <div className="text-center mb-16">
              <div className="inline-block text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-4">Онлайн-расчёт</div>
              <h2 className="font-display font-bold text-5xl md:text-6xl uppercase">КАЛЬКУЛЯТОР<br /><span className="text-[#e8c84a]">СТОИМОСТИ</span></h2>
              <p className="text-[#666] font-body mt-4 max-w-lg mx-auto">Выберите параметры шкафа и получите предварительную стоимость прямо сейчас</p>
            </div>
          </AnimSection>
          <AnimSection delay={100}>
            <Calculator />
          </AnimSection>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4">
          <AnimSection>
            <div className="text-center mb-16">
              <div className="inline-block text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-4">Отзывы клиентов</div>
              <h2 className="font-display font-bold text-5xl md:text-6xl uppercase">ЧТО О НАС<br /><span className="text-[#e8c84a]">ГОВОРЯТ</span></h2>
            </div>
          </AnimSection>

          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map(({ name, city, rating, text, avatar }, i) => (
              <AnimSection key={i} delay={i * 100}>
                <div className="p-6 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] flex flex-col gap-4 h-full">
                  <div className="flex text-[#e8c84a]">
                    {Array.from({ length: rating }).map((_, j) => (
                      <Icon key={j} name="Star" size={16} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-[#aaa] text-sm font-body leading-relaxed flex-1">«{text}»</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-[#1a1a1a]">
                    <div className="w-10 h-10 rounded-full bg-[#e8c84a]/20 flex items-center justify-center font-display font-bold text-[#e8c84a]">
                      {avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold font-body text-white">{name}</div>
                      <div className="text-xs text-[#555] font-body">{city}</div>
                    </div>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="form" className="py-24">
        <div className="max-w-2xl mx-auto px-4">
          <AnimSection>
            <div className="text-center mb-12">
              <div className="inline-block text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-4">Заявка</div>
              <h2 className="font-display font-bold text-5xl md:text-6xl uppercase">ПОЛУЧИТЬ<br /><span className="text-[#e8c84a]">ЗАМЕР</span></h2>
              <p className="text-[#666] font-body mt-4">Оставьте заявку — мы перезвоним в течение 15 минут</p>
            </div>
          </AnimSection>

          <AnimSection delay={100}>
            {!submitted ? (
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 space-y-4">
                <div>
                  <label className="text-xs font-body text-[#666] uppercase tracking-widest block mb-2">Ваше имя</label>
                  <input
                    type="text"
                    placeholder="Иван Петров"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white font-body placeholder-[#444] focus:outline-none focus:border-[#e8c84a]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-body text-[#666] uppercase tracking-widest block mb-2">Телефон</label>
                  <input
                    type="tel"
                    placeholder="+7 (999) 000-00-00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white font-body placeholder-[#444] focus:outline-none focus:border-[#e8c84a]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-body text-[#666] uppercase tracking-widest block mb-2">Комментарий</label>
                  <textarea
                    placeholder="Опишите ваш проект..."
                    rows={3}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white font-body placeholder-[#444] focus:outline-none focus:border-[#e8c84a]/50 transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={() => formData.name && formData.phone && setSubmitted(true)}
                  className="w-full py-4 bg-[#e8c84a] hover:bg-[#f0d060] text-black font-display font-bold text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Записаться на замер
                </button>
                <p className="text-xs text-[#444] font-body text-center">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
              </div>
            ) : (
              <div className="bg-[#0a0a0a] border border-[#e8c84a]/30 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#e8c84a]/20 flex items-center justify-center mx-auto mb-6">
                  <Icon name="CheckCircle" size={32} className="text-[#e8c84a]" />
                </div>
                <h3 className="font-display font-bold text-3xl text-white mb-2">Заявка принята!</h3>
                <p className="text-[#666] font-body">Перезвоним в течение 15 минут</p>
              </div>
            )}
          </AnimSection>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 bg-[#050505] border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <AnimSection>
              <div>
                <div className="font-display font-bold text-2xl tracking-widest mb-6">
                  КУПЕ<span className="text-[#e8c84a]">МАСТЕР</span>
                </div>
                <p className="text-[#555] text-sm font-body leading-relaxed">
                  Производство и установка шкафов-купе под заказ. Работаем по Москве и области.
                </p>
              </div>
            </AnimSection>

            <AnimSection delay={100}>
              <div>
                <div className="text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-4">Контакты</div>
                <div className="space-y-3">
                  {[
                    { icon: "Phone", text: "+7 (495) 000-00-00" },
                    { icon: "Mail", text: "info@kupmaster.ru" },
                    { icon: "MapPin", text: "Москва, ул. Примерная, 1" },
                    { icon: "Clock", text: "Пн–Сб: 9:00–20:00" },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-3 text-sm font-body text-[#666] hover:text-[#aaa] transition-colors">
                      <Icon name={icon} size={16} className="text-[#e8c84a]" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </AnimSection>

            <AnimSection delay={200}>
              <div>
                <div className="text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-4">Быстрые ссылки</div>
                <div className="space-y-2">
                  {[["Преимущества","advantages"],["Галерея","gallery"],["Калькулятор","calc"],["Отзывы","reviews"]].map(([label, id]) => (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className="block text-sm text-[#666] font-body hover:text-[#e8c84a] transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </AnimSection>
          </div>

          <div className="mt-12 pt-8 border-t border-[#1a1a1a] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-[#444] font-body">© 2024 КупеМастер. Все права защищены.</div>
            <div className="text-xs text-[#444] font-body">Политика конфиденциальности</div>
          </div>
        </div>
      </section>

    </div>
  );
}
