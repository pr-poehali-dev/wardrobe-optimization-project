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
  { icon: "Ruler", title: "Любые размеры", desc: "Шкаф точно по вашему проёму — от 60 до 600 см в ширину" },
  { icon: "Palette", title: "500+ вариантов отделки", desc: "Плёнки, шпон, стекло, зеркало, пескоструй и матовые фасады" },
  { icon: "Clock", title: "Срок от 7 рабочих дней", desc: "Замер, изготовление и установка — всё под ключ" },
  { icon: "ShieldCheck", title: "Гарантия 5 лет", desc: "На корпус, фурнитуру и механизмы раздвижных дверей" },
  { icon: "Wrench", title: "Собственная бригада", desc: "Монтажники в штате — без субподрядчиков и посредников" },
  { icon: "BadgePercent", title: "Цена напрямую с завода", desc: "Собственное производство в Москве — без наценки дилеров" },
];

const REVIEWS = [
  {
    name: "Анна К.",
    city: "Мытищи",
    rating: 5,
    text: "Заказывала шкаф в спальню с нестандартной шириной — 2,4 метра. Замерщик приехал на следующий день, через неделю уже привезли и собрали. Всё подошло идеально, фасады выбирала по каталогу — очень довольна результатом.",
    avatar: "А",
  },
  {
    name: "Сергей М.",
    city: "Москва, Бутово",
    rating: 5,
    text: "Брали шкаф-купе с зеркальными дверями и LED-подсветкой. Сборщики отработали аккуратно, всё чисто убрали за собой. Фурнитура ходит плавно, без скрипа. Уже полгода — ни одной проблемы.",
    avatar: "С",
  },
  {
    name: "Елена Р.",
    city: "Красногорск",
    rating: 5,
    text: "Это уже второй шкаф от КупеМастер — первый стоит в коридоре больше трёх лет, ни разу не ломался. Ценами довольна: посчитала несколько компаний — здесь вышло выгоднее при лучшем качестве. Рекомендую.",
    avatar: "Е",
  },
];

function useInView(threshold = 0.12) {
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
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Calculator({ onOrder }: { onOrder: () => void }) {
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
    hanger: 1800,
    led: 2200,
    safe: 3500,
  };

  const basePrice = Math.round((width / 100) * (height / 100) * 14800);
  const doorExtra = doors * DOOR_PRICES[doorType];
  const fillExtra = filling.reduce((s, k) => s + (FILL_PRICES[k] ?? 0), 0);
  const total = basePrice + doorExtra + fillExtra;

  const toggleFill = (key: string) =>
    setFilling((prev) => prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]);

  return (
    <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-5 md:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-body text-[#999] mb-2 uppercase tracking-widest">
              Ширина: <span className="text-[#e8c84a] font-semibold">{width} см</span>
            </label>
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
            <label className="block text-sm font-body text-[#999] mb-2 uppercase tracking-widest">
              Высота: <span className="text-[#e8c84a] font-semibold">{height} см</span>
            </label>
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
            <label className="block text-sm font-body text-[#999] mb-3 uppercase tracking-widest">Материал фасадов</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "ldsp", label: "ЛДСП", price: "входит в базу" },
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
            <label className="block text-sm font-body text-[#999] mb-3 uppercase tracking-widest">Внутреннее наполнение</label>
            <div className="space-y-2">
              {[
                { key: "shelves", label: "Дополнительные полки", icon: "AlignJustify", price: "+1 200 ₽" },
                { key: "drawers", label: "Выдвижные ящики", icon: "Package", price: "+2 800 ₽" },
                { key: "hanger", label: "Штанга для одежды", icon: "Shirt", price: "+1 800 ₽" },
                { key: "led", label: "LED-подсветка", icon: "Lightbulb", price: "+2 200 ₽" },
                { key: "safe", label: "Встроенный мини-сейф", icon: "Lock", price: "+3 500 ₽" },
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
                  <span className="text-xs text-[#555] font-body flex-shrink-0">{price}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#e8c84a]/20 to-[#f0a030]/10 border border-[#e8c84a]/30 rounded-2xl p-5">
            <div className="text-xs text-[#999] font-body mb-1 uppercase tracking-widest">Предварительная стоимость</div>
            <div className="text-4xl md:text-5xl font-display font-bold text-[#e8c84a] tracking-tight">
              {total.toLocaleString("ru-RU")} ₽
            </div>
            <div className="text-xs text-[#666] font-body mt-2 leading-relaxed">
              Точная цена — после бесплатного замера на дому
            </div>

            <div className="mt-4 space-y-1.5 border-t border-[#e8c84a]/20 pt-4">
              <div className="flex justify-between text-sm font-body">
                <span className="text-[#777]">Базовая цена ({width}×{height} см)</span>
                <span className="text-[#aaa]">{basePrice.toLocaleString("ru-RU")} ₽</span>
              </div>
              {doorExtra > 0 && (
                <div className="flex justify-between text-sm font-body">
                  <span className="text-[#777]">Фасады ({doors} дв.)</span>
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

            <button
              onClick={onOrder}
              className="mt-5 w-full py-4 bg-[#e8c84a] hover:bg-[#f0d060] text-black font-display font-semibold text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
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
  const [formError, setFormError] = useState("");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) { setFormError("Пожалуйста, укажите ваше имя"); return; }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) { setFormError("Укажите корректный номер телефона"); return; }
    setFormError("");
    setSubmitted(true);
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
            {[["Преимущества", "advantages"], ["Галерея", "gallery"], ["Отзывы", "reviews"], ["Контакты", "contacts"]].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} className="hover:text-[#e8c84a] transition-colors">{label}</button>
            ))}
          </div>
          <button
            onClick={() => scrollTo("calc")}
            className="px-5 py-2 bg-[#e8c84a] text-black font-display font-semibold text-sm rounded-xl hover:bg-[#f0d060] transition-all active:scale-95"
          >
            Рассчитать цену
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#e8c84a]/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#f0a030]/8 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle, #e8c84a 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8c84a]/30 bg-[#e8c84a]/10 text-[#e8c84a] text-sm font-body mb-6"
              style={{ animation: "fade-up 0.6s ease forwards" }}
            >
              <Icon name="Sparkles" size={14} />
              Производство в Москве · Гарантия 5 лет
            </div>

            <h1
              className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6 uppercase"
              style={{ animation: "fade-up 0.7s ease 0.1s forwards", opacity: 0 }}
            >
              ШКАФЫ<br />
              <span className="text-[#e8c84a]">-КУПЕ</span><br />
              НА ЗАКАЗ
            </h1>

            <p
              className="text-[#888] text-base md:text-lg max-w-md leading-relaxed mb-8 font-body"
              style={{ animation: "fade-up 0.7s ease 0.2s forwards", opacity: 0 }}
            >
              Изготавливаем шкафы-купе точно по вашим размерам. Замер, производство и установка под ключ — от 7 рабочих дней.
            </p>

            <div
              className="flex flex-wrap gap-3 md:gap-4"
              style={{ animation: "fade-up 0.7s ease 0.3s forwards", opacity: 0 }}
            >
              <button
                onClick={() => scrollTo("calc")}
                className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-[#e8c84a] text-black font-display font-semibold text-base md:text-lg rounded-2xl hover:bg-[#f0d060] transition-all hover:scale-105 active:scale-95"
              >
                <Icon name="Calculator" size={20} />
                Рассчитать стоимость
              </button>
              <button
                onClick={() => scrollTo("gallery")}
                className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 border border-[#333] text-white font-display font-semibold text-base md:text-lg rounded-2xl hover:border-[#e8c84a]/50 hover:text-[#e8c84a] transition-all active:scale-95"
              >
                Посмотреть работы
              </button>
            </div>

            <div
              className="flex gap-6 md:gap-8 mt-10 md:mt-12 pt-8 border-t border-[#1a1a1a]"
              style={{ animation: "fade-up 0.7s ease 0.4s forwards", opacity: 0 }}
            >
              {[["500+", "Выполненных проектов"], ["7", "Дней от замера до установки"], ["5", "Лет гарантии"]].map(([num, label]) => (
                <div key={num}>
                  <div className="font-display font-bold text-2xl md:text-3xl text-[#e8c84a]">{num}</div>
                  <div className="text-xs md:text-sm text-[#666] font-body mt-1 leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative"
            style={{ animation: "scale-in 0.8s ease 0.3s forwards", opacity: 0 }}
          >
            <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: "4/5" }}>
              <img
                src={GALLERY_IMAGES[0].src}
                alt="Шкаф-купе на заказ"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="bg-[#0f0f0f]/85 backdrop-blur-sm rounded-2xl p-4 border border-[#2a2a2a] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-[#666] font-body uppercase tracking-widest">Стоимость от</div>
                    <div className="font-display font-bold text-2xl text-[#e8c84a]">29 800 ₽</div>
                  </div>
                  <button
                    onClick={() => scrollTo("form")}
                    className="px-4 py-2.5 bg-[#e8c84a] text-black text-sm font-display font-semibold rounded-xl hover:bg-[#f0d060] transition-all active:scale-95 whitespace-nowrap"
                  >
                    Заказать
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#e8c84a]/10 border border-[#e8c84a]/20 flex flex-col items-center justify-center">
              <div className="font-display font-bold text-xl md:text-2xl text-[#e8c84a]">7</div>
              <div className="text-[10px] text-[#888] font-body text-center leading-tight">дней<br />срок</div>
            </div>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section id="advantages" className="py-20 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <AnimSection>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-4">Почему выбирают нас</div>
              <h2 className="font-display font-bold text-4xl md:text-6xl uppercase text-white">
                НАШИ<br /><span className="text-[#e8c84a]">ПРЕИМУЩЕСТВА</span>
              </h2>
            </div>
          </AnimSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADVANTAGES.map(({ icon, title, desc }, i) => (
              <AnimSection key={i} delay={i * 70}>
                <div className="group p-6 rounded-2xl border border-[#1a1a1a] hover:border-[#e8c84a]/30 bg-[#0a0a0a] hover:bg-[#0f0f0f] transition-all cursor-default h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#e8c84a]/10 flex items-center justify-center mb-4 group-hover:bg-[#e8c84a]/20 transition-all">
                    <Icon name={icon} size={22} className="text-[#e8c84a]" />
                  </div>
                  <h3 className="font-display font-semibold text-lg md:text-xl text-white mb-2">{title}</h3>
                  <p className="text-[#666] text-sm font-body leading-relaxed">{desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-20 md:py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4">
          <AnimSection>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-4">Примеры работ</div>
              <h2 className="font-display font-bold text-4xl md:text-6xl uppercase">
                НАШИ<br /><span className="text-[#e8c84a]">РАБОТЫ</span>
              </h2>
            </div>
          </AnimSection>

          <AnimSection delay={100}>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {GALLERY_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveGallery(i)}
                  className={`px-5 py-2 rounded-xl font-body text-sm transition-all active:scale-95 ${activeGallery === i ? "bg-[#e8c84a] text-black font-semibold" : "bg-[#1a1a1a] text-[#888] hover:bg-[#222]"}`}
                >
                  {img.label}
                </button>
              ))}
            </div>

            <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <img
                key={activeGallery}
                src={GALLERY_IMAGES[activeGallery].src}
                alt={GALLERY_IMAGES[activeGallery].label}
                className="w-full h-full object-cover"
                style={{ animation: "fade-in 0.4s ease" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/50 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                <div className="font-display font-bold text-2xl md:text-3xl text-white">{GALLERY_IMAGES[activeGallery].label}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-3 mt-2 md:mt-3">
              {GALLERY_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveGallery(i)}
                  className={`rounded-xl md:rounded-2xl overflow-hidden transition-all active:scale-98 ${activeGallery === i ? "ring-2 ring-[#e8c84a]" : "opacity-50 hover:opacity-80"}`}
                  style={{ aspectRatio: "16/9" }}
                >
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </AnimSection>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calc" className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <AnimSection>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-4">Онлайн-расчёт</div>
              <h2 className="font-display font-bold text-4xl md:text-6xl uppercase">
                КАЛЬКУЛЯТОР<br /><span className="text-[#e8c84a]">СТОИМОСТИ</span>
              </h2>
              <p className="text-[#666] font-body mt-4 max-w-lg mx-auto text-sm md:text-base">
                Выберите параметры шкафа — получите предварительную стоимость. Точная цена формируется после бесплатного замера.
              </p>
            </div>
          </AnimSection>
          <AnimSection delay={100}>
            <Calculator onOrder={() => scrollTo("form")} />
          </AnimSection>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 md:py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4">
          <AnimSection>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-4">Отзывы клиентов</div>
              <h2 className="font-display font-bold text-4xl md:text-6xl uppercase">
                ЧТО О НАС<br /><span className="text-[#e8c84a]">ГОВОРЯТ</span>
              </h2>
            </div>
          </AnimSection>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {REVIEWS.map(({ name, city, rating, text, avatar }, i) => (
              <AnimSection key={i} delay={i * 90}>
                <div className="p-5 md:p-6 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] flex flex-col gap-4 h-full">
                  <div className="flex text-[#e8c84a] gap-0.5">
                    {Array.from({ length: rating }).map((_, j) => (
                      <Icon key={j} name="Star" size={15} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-[#aaa] text-sm font-body leading-relaxed flex-1">«{text}»</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-[#1a1a1a]">
                    <div className="w-10 h-10 rounded-full bg-[#e8c84a]/20 flex items-center justify-center font-display font-bold text-[#e8c84a] flex-shrink-0">
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
      <section id="form" className="py-20 md:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <AnimSection>
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-block text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-4">Бесплатный замер</div>
              <h2 className="font-display font-bold text-4xl md:text-6xl uppercase">
                ОСТАВИТЬ<br /><span className="text-[#e8c84a]">ЗАЯВКУ</span>
              </h2>
              <p className="text-[#666] font-body mt-4 text-sm md:text-base">
                Заполните форму — перезвоним в течение 15 минут и согласуем удобное время замера
              </p>
            </div>
          </AnimSection>

          <AnimSection delay={100}>
            {!submitted ? (
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 space-y-4">
                <div>
                  <label className="text-xs font-body text-[#666] uppercase tracking-widest block mb-2">Ваше имя *</label>
                  <input
                    type="text"
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setFormError(""); }}
                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white font-body placeholder-[#444] focus:outline-none focus:border-[#e8c84a]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-body text-[#666] uppercase tracking-widest block mb-2">Телефон *</label>
                  <input
                    type="tel"
                    placeholder="+7 (999) 000-00-00"
                    value={formData.phone}
                    onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setFormError(""); }}
                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white font-body placeholder-[#444] focus:outline-none focus:border-[#e8c84a]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-body text-[#666] uppercase tracking-widest block mb-2">Комментарий</label>
                  <textarea
                    placeholder="Опишите задачу: размеры, пожелания по дизайну, сроки..."
                    rows={3}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white font-body placeholder-[#444] focus:outline-none focus:border-[#e8c84a]/50 transition-colors resize-none"
                  />
                </div>
                {formError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm font-body">
                    <Icon name="AlertCircle" size={16} />
                    {formError}
                  </div>
                )}
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-[#e8c84a] hover:bg-[#f0d060] text-black font-display font-bold text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Записаться на замер
                </button>
                <p className="text-xs text-[#444] font-body text-center">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </div>
            ) : (
              <div className="bg-[#0a0a0a] border border-[#e8c84a]/30 rounded-2xl p-10 md:p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#e8c84a]/20 flex items-center justify-center mx-auto mb-6">
                  <Icon name="CheckCircle" size={32} className="text-[#e8c84a]" />
                </div>
                <h3 className="font-display font-bold text-3xl text-white mb-3">Заявка отправлена!</h3>
                <p className="text-[#777] font-body text-sm leading-relaxed max-w-xs mx-auto">
                  Наш менеджер свяжется с вами в течение 15 минут и согласует удобное время для замера
                </p>
              </div>
            )}
          </AnimSection>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-20 md:py-24 bg-[#050505] border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <AnimSection>
              <div>
                <div className="font-display font-bold text-2xl tracking-widest mb-4">
                  КУПЕ<span className="text-[#e8c84a]">МАСТЕР</span>
                </div>
                <p className="text-[#555] text-sm font-body leading-relaxed">
                  Производство и установка шкафов-купе на заказ. Работаем по Москве и Московской области.
                </p>
              </div>
            </AnimSection>

            <AnimSection delay={100}>
              <div>
                <div className="text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-5">Контакты</div>
                <div className="space-y-3">
                  {[
                    { icon: "Phone", text: "+7 (495) 000-00-00" },
                    { icon: "Mail", text: "info@kupmaster.ru" },
                    { icon: "MapPin", text: "Работаем по Москве и Московской области" },
                    { icon: "Clock", text: "Пн–Сб: 9:00–20:00" },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-start gap-3 text-sm font-body text-[#666]">
                      <Icon name={icon} size={16} className="text-[#e8c84a] flex-shrink-0 mt-0.5" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimSection>

            <AnimSection delay={200}>
              <div>
                <div className="text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-5">Навигация</div>
                <div className="space-y-2.5">
                  {[["Преимущества", "advantages"], ["Галерея работ", "gallery"], ["Калькулятор", "calc"], ["Отзывы", "reviews"], ["Оставить заявку", "form"]].map(([label, id]) => (
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

          <div className="mt-12 pt-8 border-t border-[#1a1a1a] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-[#444] font-body">© 2026 КупеМастер. Все права защищены.</div>
            <button className="text-xs text-[#444] font-body hover:text-[#666] transition-colors">
              Политика конфиденциальности
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
