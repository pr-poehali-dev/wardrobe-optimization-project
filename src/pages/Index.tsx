import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const GALLERY_IMAGES = [
  {
    src: "https://cdn.poehali.dev/projects/9be08719-4afb-4d38-8e11-9d291b6cad41/files/52d6db63-19c0-4145-950d-303dfb0baeb6.jpg",
    label: "Шкаф в спальню",
  },
  {
    src: "https://cdn.poehali.dev/projects/9be08719-4afb-4d38-8e11-9d291b6cad41/files/38bd3336-99fd-4e07-b13b-c4e66eabe406.jpg",
    label: "Шкаф с зеркалом",
  },
  {
    src: "https://cdn.poehali.dev/projects/9be08719-4afb-4d38-8e11-9d291b6cad41/files/88b7fbeb-4cd1-41ce-806b-7d1b072de879.jpg",
    label: "Встроенный в нишу",
  },
];

const ADVANTAGES = [
  { icon: "Ruler", title: "Любые размеры", desc: "Точно по вашему проёму — от 60 до 600 см" },
  { icon: "Palette", title: "500+ вариантов отделки", desc: "Плёнки, шпон, стекло, зеркало, матовые фасады" },
  { icon: "Clock", title: "Срок от 7 рабочих дней", desc: "Замер → производство → установка под ключ" },
  { icon: "ShieldCheck", title: "Гарантия 5 лет", desc: "На корпус, фурнитуру и механизмы дверей" },
  { icon: "Wrench", title: "Собственная бригада", desc: "Монтажники в штате, без субподрядчиков" },
  { icon: "BadgePercent", title: "Цена без наценок", desc: "Собственное производство — ни одного посредника" },
];

const REVIEWS = [
  {
    name: "Анна К.",
    city: "Мытищи",
    rating: 5,
    text: "Заказывала шкаф в спальню 2,4 м — нестандартная ширина. Замерщик приехал на следующий день, через 8 рабочих дней привезли и собрали. Всё подошло идеально.",
    avatar: "А",
  },
  {
    name: "Сергей М.",
    city: "Москва, Бутово",
    rating: 5,
    text: "Шкаф-купе с зеркальными дверями и LED. Сборщики отработали аккуратно, всё убрали за собой. Полгода — ни одной поломки, фурнитура ходит мягко.",
    avatar: "С",
  },
  {
    name: "Елена Р.",
    city: "Красногорск",
    rating: 5,
    text: "Второй шкаф от КупеМастер — первый стоит в коридоре уже три года без проблем. Цена вышла честнее конкурентов при лучшем качестве исполнения.",
    avatar: "Е",
  },
];

const TRUST_MARKERS = [
  { icon: "MapPin", label: "Бесплатный замер" },
  { icon: "Factory", label: "Собственное производство" },
  { icon: "Hammer", label: "Монтаж под ключ" },
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

function AnimSection({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-block text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-4">{children}</div>
  );
}

function Calculator({ onOrder }: { onOrder: () => void }) {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(240);
  const [doors, setDoors] = useState(2);
  const [filling, setFilling] = useState<string[]>([]);
  const [doorType, setDoorType] = useState("ldsp");

  const DOOR_PRICES: Record<string, number> = { ldsp: 0, mirror: 4500, glass: 6000, rattan: 5500 };
  const FILL_PRICES: Record<string, number> = { shelves: 1200, drawers: 2800, hanger: 1800, led: 2200, safe: 3500 };

  const basePrice = Math.round((width / 100) * (height / 100) * 14800);
  const doorExtra = doors * DOOR_PRICES[doorType];
  const fillExtra = filling.reduce((s, k) => s + (FILL_PRICES[k] ?? 0), 0);
  const total = basePrice + doorExtra + fillExtra;

  const toggleFill = (key: string) =>
    setFilling((prev) => prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]);

  return (
    <div className="bg-[#0d0d0d] border border-[#222] rounded-2xl p-5 md:p-8">
      <div className="grid md:grid-cols-2 gap-8 md:gap-10">

        <div className="space-y-7">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-body text-[#666] uppercase tracking-widest">Ширина</span>
              <span className="font-display font-semibold text-[#e8c84a] text-lg">{width} см</span>
            </div>
            <input
              type="range" min={60} max={600} step={10} value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full accent-[#e8c84a] h-1.5 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#444] mt-1.5 font-body">
              <span>60 см</span><span>600 см</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-body text-[#666] uppercase tracking-widest">Высота</span>
              <span className="font-display font-semibold text-[#e8c84a] text-lg">{height} см</span>
            </div>
            <input
              type="range" min={180} max={290} step={5} value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-[#e8c84a] h-1.5 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#444] mt-1.5 font-body">
              <span>180 см</span><span>290 см</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-body text-[#666] uppercase tracking-widest block mb-3">Количество дверей</span>
            <div className="flex gap-2">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setDoors(n)}
                  className={`flex-1 py-2.5 rounded-xl font-display text-lg font-semibold transition-all ${doors === n ? "bg-[#e8c84a] text-black" : "bg-[#181818] text-[#666] hover:bg-[#222]"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-body text-[#666] uppercase tracking-widest block mb-3">Материал фасадов</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "ldsp", label: "ЛДСП", price: "в базе" },
                { key: "mirror", label: "Зеркало", price: "+4 500 ₽/дв." },
                { key: "glass", label: "Стекло", price: "+6 000 ₽/дв." },
                { key: "rattan", label: "Ротанг", price: "+5 500 ₽/дв." },
              ].map(({ key, label, price }) => (
                <button
                  key={key}
                  onClick={() => setDoorType(key)}
                  className={`p-3 rounded-xl text-left transition-all border ${doorType === key ? "border-[#e8c84a] bg-[#e8c84a]/10" : "border-[#222] hover:border-[#444]"}`}
                >
                  <div className={`text-sm font-semibold font-body ${doorType === key ? "text-[#e8c84a]" : "text-white"}`}>{label}</div>
                  <div className="text-[11px] text-[#555] font-body mt-0.5">{price}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <span className="text-xs font-body text-[#666] uppercase tracking-widest block mb-3">Внутреннее наполнение</span>
            <div className="space-y-1.5">
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all border ${filling.includes(key) ? "border-[#e8c84a] bg-[#e8c84a]/8" : "border-[#1e1e1e] hover:border-[#333]"}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${filling.includes(key) ? "bg-[#e8c84a] text-black" : "bg-[#1a1a1a] text-[#555]"}`}>
                    <Icon name={icon} size={14} />
                  </div>
                  <span className={`text-sm font-body flex-1 text-left ${filling.includes(key) ? "text-white" : "text-[#777]"}`}>{label}</span>
                  <span className="text-[11px] text-[#444] font-body flex-shrink-0">{price}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#e8c84a]/15 to-[#f0a030]/8 border border-[#e8c84a]/25 rounded-2xl p-5">
            <div className="text-[11px] text-[#888] font-body uppercase tracking-widest mb-1">Предварительная стоимость</div>
            <div className="text-4xl md:text-5xl font-display font-bold text-[#e8c84a] tracking-tight leading-none">
              {total.toLocaleString("ru-RU")} ₽
            </div>
            <div className="text-xs text-[#555] font-body mt-2 leading-relaxed">
              Цена зависит от размеров, фасадов и наполнения.<br />Точная стоимость — после бесплатного замера.
            </div>

            <div className="mt-4 space-y-1.5 pt-4 border-t border-[#e8c84a]/15">
              <div className="flex justify-between text-xs font-body">
                <span className="text-[#666]">Корпус {width}×{height} см</span>
                <span className="text-[#999]">{basePrice.toLocaleString("ru-RU")} ₽</span>
              </div>
              {doorExtra > 0 && (
                <div className="flex justify-between text-xs font-body">
                  <span className="text-[#666]">Фасады ({doors} дв.)</span>
                  <span className="text-[#999]">+{doorExtra.toLocaleString("ru-RU")} ₽</span>
                </div>
              )}
              {fillExtra > 0 && (
                <div className="flex justify-between text-xs font-body">
                  <span className="text-[#666]">Наполнение</span>
                  <span className="text-[#999]">+{fillExtra.toLocaleString("ru-RU")} ₽</span>
                </div>
              )}
            </div>

            <button
              onClick={onOrder}
              className="mt-5 w-full py-3.5 bg-[#e8c84a] hover:bg-[#f0d060] text-black font-display font-semibold text-base rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97]"
            >
              Заказать замер бесплатно
            </button>
            <div className="text-[10px] text-[#444] font-body text-center mt-2.5">
              Предварительный расчёт, не является публичной офертой
            </div>
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
    if (!formData.name.trim()) { setFormError("Укажите ваше имя"); return; }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) { setFormError("Укажите корректный номер телефона"); return; }
    setFormError("");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-body overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/92 backdrop-blur-md border-b border-[#161616]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="font-display font-bold text-lg sm:text-xl tracking-widest text-white flex-shrink-0">
            КУПЕ<span className="text-[#e8c84a]">МАСТЕР</span>
          </div>
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-[#777] font-body">
            {[["Преимущества", "advantages"], ["Галерея", "gallery"], ["Калькулятор", "calc"], ["Отзывы", "reviews"]].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} className="hover:text-[#e8c84a] transition-colors">{label}</button>
            ))}
          </div>
          <button
            onClick={() => scrollTo("form")}
            className="flex-shrink-0 px-4 sm:px-5 py-2 bg-[#e8c84a] text-black font-display font-semibold text-sm rounded-xl hover:bg-[#f0d060] transition-all active:scale-95"
          >
            Заказать замер
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#e8c84a]/6 blur-[120px]" />
          <div className="absolute bottom-0 right-[-100px] w-[400px] h-[500px] rounded-full bg-[#f0a030]/6 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "radial-gradient(circle, #e8c84a 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-16 items-center w-full">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e8c84a]/25 bg-[#e8c84a]/8 text-[#e8c84a] text-xs sm:text-sm font-body mb-6"
              style={{ animation: "fade-up 0.55s ease forwards" }}
            >
              <Icon name="MapPin" size={13} />
              Москва и Московская область · Гарантия 5 лет
            </div>

            <h1
              className="font-display font-bold text-[48px] sm:text-6xl md:text-7xl lg:text-[80px] leading-[0.93] tracking-tight mb-6 uppercase"
              style={{ animation: "fade-up 0.65s ease 0.1s forwards", opacity: 0 }}
            >
              ШКАФЫ‑КУПЕ<br />
              <span className="text-[#e8c84a]">ПО ВАШИМ</span><br />
              РАЗМЕРАМ
            </h1>

            <p
              className="text-[#777] text-base md:text-lg max-w-md leading-relaxed mb-6 font-body"
              style={{ animation: "fade-up 0.65s ease 0.18s forwards", opacity: 0 }}
            >
              Изготавливаем шкафы точно под ваш проём. Замер, производство и установка — от 7 рабочих дней.
            </p>

            <div
              className="flex flex-wrap gap-2 mb-8"
              style={{ animation: "fade-up 0.65s ease 0.25s forwards", opacity: 0 }}
            >
              {TRUST_MARKERS.map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111] border border-[#222] text-sm font-body text-[#999]">
                  <Icon name={icon} size={13} className="text-[#e8c84a]" />
                  {label}
                </div>
              ))}
            </div>

            <div
              className="flex flex-wrap gap-3"
              style={{ animation: "fade-up 0.65s ease 0.32s forwards", opacity: 0 }}
            >
              <button
                onClick={() => scrollTo("calc")}
                className="flex items-center gap-2 px-7 py-3.5 bg-[#e8c84a] text-black font-display font-semibold text-base rounded-2xl hover:bg-[#f0d060] transition-all hover:scale-105 active:scale-95"
              >
                <Icon name="Calculator" size={18} />
                Рассчитать стоимость
              </button>
              <button
                onClick={() => scrollTo("gallery")}
                className="flex items-center gap-2 px-7 py-3.5 border border-[#2a2a2a] text-[#aaa] font-display font-semibold text-base rounded-2xl hover:border-[#e8c84a]/40 hover:text-[#e8c84a] transition-all active:scale-95"
              >
                Посмотреть работы
              </button>
            </div>

            <div
              className="flex gap-6 md:gap-8 mt-10 pt-8 border-t border-[#161616]"
              style={{ animation: "fade-up 0.65s ease 0.4s forwards", opacity: 0 }}
            >
              {[["500+", "Выполненных проектов"], ["7", "Дней от замера"], ["5 лет", "Гарантия"]].map(([num, label]) => (
                <div key={num}>
                  <div className="font-display font-bold text-2xl md:text-3xl text-[#e8c84a]">{num}</div>
                  <div className="text-xs text-[#555] font-body mt-1 leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative"
            style={{ animation: "scale-in 0.75s ease 0.25s forwards", opacity: 0 }}
          >
            <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: "4/5" }}>
              <img
                src={GALLERY_IMAGES[0].src}
                alt="Шкаф-купе на заказ в Москве"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/65 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="bg-[#0c0c0c]/88 backdrop-blur-md rounded-2xl p-4 border border-[#252525]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] text-[#555] font-body uppercase tracking-widest mb-0.5">Стоимость от</div>
                      <div className="font-display font-bold text-2xl text-[#e8c84a]">29 800 ₽</div>
                      <div className="text-[11px] text-[#555] font-body mt-1 leading-tight">
                        Зависит от размеров,<br />фасадов и наполнения
                      </div>
                    </div>
                    <button
                      onClick={() => scrollTo("form")}
                      className="flex-shrink-0 px-4 py-2.5 bg-[#e8c84a] text-black text-sm font-display font-semibold rounded-xl hover:bg-[#f0d060] transition-all active:scale-95"
                    >
                      Заказать
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 w-20 h-20 rounded-2xl bg-[#e8c84a]/8 border border-[#e8c84a]/18 flex flex-col items-center justify-center">
              <div className="font-display font-bold text-xl text-[#e8c84a]">7</div>
              <div className="text-[10px] text-[#666] font-body text-center leading-tight">дней<br />срок</div>
            </div>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section id="advantages" className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimSection>
            <div className="text-center mb-12 md:mb-14">
              <SectionLabel>Почему выбирают нас</SectionLabel>
              <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl uppercase">
                НАШИ<br /><span className="text-[#e8c84a]">ПРЕИМУЩЕСТВА</span>
              </h2>
            </div>
          </AnimSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {ADVANTAGES.map(({ icon, title, desc }, i) => (
              <AnimSection key={i} delay={i * 60}>
                <div className="group p-5 md:p-6 rounded-2xl border border-[#161616] hover:border-[#e8c84a]/25 bg-[#0a0a0a] hover:bg-[#0d0d0d] transition-all cursor-default h-full">
                  <div className="w-11 h-11 rounded-xl bg-[#e8c84a]/8 flex items-center justify-center mb-4 group-hover:bg-[#e8c84a]/16 transition-all">
                    <Icon name={icon} size={20} className="text-[#e8c84a]" />
                  </div>
                  <h3 className="font-display font-semibold text-base md:text-lg text-white mb-1.5">{title}</h3>
                  <p className="text-[#555] text-sm font-body leading-relaxed">{desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-20 md:py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimSection>
            <div className="text-center mb-12 md:mb-14">
              <SectionLabel>Примеры работ</SectionLabel>
              <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl uppercase">
                НАШИ<br /><span className="text-[#e8c84a]">РАБОТЫ</span>
              </h2>
            </div>
          </AnimSection>

          <AnimSection delay={100}>
            <div className="flex flex-wrap gap-2 justify-center mb-5">
              {GALLERY_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveGallery(i)}
                  className={`px-4 py-2 rounded-xl font-body text-sm transition-all active:scale-95 ${activeGallery === i ? "bg-[#e8c84a] text-black font-semibold" : "bg-[#141414] text-[#777] hover:bg-[#1e1e1e] border border-[#222]"}`}
                >
                  {img.label}
                </button>
              ))}
            </div>

            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <img
                key={activeGallery}
                src={GALLERY_IMAGES[activeGallery].src}
                alt={GALLERY_IMAGES[activeGallery].label}
                className="w-full h-full object-cover"
                style={{ animation: "fade-in 0.4s ease" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/55 to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
                <div className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-white">{GALLERY_IMAGES[activeGallery].label}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
              {GALLERY_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveGallery(i)}
                  className={`rounded-xl overflow-hidden transition-all ${activeGallery === i ? "ring-2 ring-[#e8c84a]" : "opacity-45 hover:opacity-70"}`}
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AnimSection>
            <div className="text-center mb-12 md:mb-14">
              <SectionLabel>Онлайн-расчёт</SectionLabel>
              <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl uppercase">
                КАЛЬКУЛЯТОР<br /><span className="text-[#e8c84a]">СТОИМОСТИ</span>
              </h2>
              <p className="text-[#555] font-body mt-4 max-w-md mx-auto text-sm">
                Выберите параметры — получите ориентировочную цену. Точная стоимость формируется после замера.
              </p>
            </div>
          </AnimSection>
          <AnimSection delay={80}>
            <Calculator onOrder={() => scrollTo("form")} />
          </AnimSection>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 md:py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimSection>
            <div className="text-center mb-12 md:mb-14">
              <SectionLabel>Отзывы клиентов</SectionLabel>
              <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl uppercase">
                ЧТО О НАС<br /><span className="text-[#e8c84a]">ГОВОРЯТ</span>
              </h2>
            </div>
          </AnimSection>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {REVIEWS.map(({ name, city, rating, text, avatar }, i) => (
              <AnimSection key={i} delay={i * 80}>
                <div className="p-5 md:p-6 rounded-2xl border border-[#161616] bg-[#0a0a0a] flex flex-col gap-4 h-full">
                  <div className="flex text-[#e8c84a] gap-0.5">
                    {Array.from({ length: rating }).map((_, j) => (
                      <Icon key={j} name="Star" size={14} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-[#999] text-sm font-body leading-relaxed flex-1">«{text}»</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-[#161616]">
                    <div className="w-9 h-9 rounded-full bg-[#e8c84a]/15 flex items-center justify-center font-display font-bold text-[#e8c84a] text-sm flex-shrink-0">
                      {avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold font-body text-white">{name}</div>
                      <div className="text-[11px] text-[#444] font-body">{city}</div>
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
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <AnimSection>
            <div className="text-center mb-10">
              <SectionLabel>Бесплатный замер</SectionLabel>
              <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl uppercase">
                ОСТАВИТЬ<br /><span className="text-[#e8c84a]">ЗАЯВКУ</span>
              </h2>
              <p className="text-[#555] font-body mt-4 text-sm">
                Заполните форму — перезвоним в течение 15 минут
              </p>
            </div>
          </AnimSection>

          <AnimSection delay={80}>
            {!submitted ? (
              <div className="bg-[#0a0a0a] border border-[#161616] rounded-2xl p-6 md:p-8 space-y-4">
                <div>
                  <label className="text-[11px] font-body text-[#555] uppercase tracking-widest block mb-2">Ваше имя *</label>
                  <input
                    type="text"
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setFormError(""); }}
                    className="w-full bg-[#0f0f0f] border border-[#222] rounded-xl px-4 py-3 text-white font-body placeholder-[#333] focus:outline-none focus:border-[#e8c84a]/40 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-body text-[#555] uppercase tracking-widest block mb-2">Телефон *</label>
                  <input
                    type="tel"
                    placeholder="+7 (999) 000-00-00"
                    value={formData.phone}
                    onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setFormError(""); }}
                    className="w-full bg-[#0f0f0f] border border-[#222] rounded-xl px-4 py-3 text-white font-body placeholder-[#333] focus:outline-none focus:border-[#e8c84a]/40 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-body text-[#555] uppercase tracking-widest block mb-2">Комментарий</label>
                  <textarea
                    placeholder="Размеры, пожелания по дизайну, сроки..."
                    rows={3}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full bg-[#0f0f0f] border border-[#222] rounded-xl px-4 py-3 text-white font-body placeholder-[#333] focus:outline-none focus:border-[#e8c84a]/40 transition-colors resize-none text-sm"
                  />
                </div>
                {formError && (
                  <div className="flex items-center gap-2 text-red-400 text-xs font-body">
                    <Icon name="AlertCircle" size={14} />
                    {formError}
                  </div>
                )}
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-[#e8c84a] hover:bg-[#f0d060] text-black font-display font-bold text-base rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Записаться на замер
                </button>
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <Icon name="ShieldCheck" size={13} className="text-[#444]" />
                  <p className="text-[11px] text-[#444] font-body">
                    Без спама. Только согласование замера и расчёта.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#0a0a0a] border border-[#e8c84a]/25 rounded-2xl p-10 md:p-12 text-center">
                <div className="w-14 h-14 rounded-full bg-[#e8c84a]/15 flex items-center justify-center mx-auto mb-5">
                  <Icon name="CheckCircle" size={28} className="text-[#e8c84a]" />
                </div>
                <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-3">Заявка отправлена!</h3>
                <p className="text-[#666] font-body text-sm leading-relaxed max-w-xs mx-auto">
                  Перезвоним в течение 15 минут и согласуем удобное время для бесплатного замера
                </p>
              </div>
            )}
          </AnimSection>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-20 bg-[#050505] border-t border-[#111]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <AnimSection>
            <div className="bg-gradient-to-br from-[#e8c84a]/10 to-[#f0a030]/5 border border-[#e8c84a]/20 rounded-3xl p-8 md:p-12">
              <div className="text-xs font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-4">Готовы обсудить проект?</div>
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl uppercase text-white mb-4">
                ЗАМЕР — БЕСПЛАТНО.<br />
                <span className="text-[#e8c84a]">РЕЗУЛЬТАТ — ПОД КЛЮЧ.</span>
              </h2>
              <p className="text-[#666] font-body text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
                Выезд замерщика по Москве и МО без оплаты. Готовое предложение — в тот же день.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => scrollTo("form")}
                  className="flex items-center gap-2 px-7 py-3.5 bg-[#e8c84a] text-black font-display font-bold text-base rounded-2xl hover:bg-[#f0d060] transition-all hover:scale-105 active:scale-95"
                >
                  <Icon name="Calendar" size={18} />
                  Заказать бесплатный замер
                </button>
                <a
                  href="tel:+74950000000"
                  className="flex items-center gap-2 px-7 py-3.5 border border-[#2a2a2a] text-[#aaa] font-display font-semibold text-base rounded-2xl hover:border-[#e8c84a]/40 hover:text-[#e8c84a] transition-all active:scale-95"
                >
                  <Icon name="Phone" size={18} />
                  +7 (495) 000-00-00
                </a>
              </div>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacts" className="py-16 md:py-20 bg-[#040404] border-t border-[#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <AnimSection>
              <div>
                <div className="font-display font-bold text-xl tracking-widest mb-4">
                  КУПЕ<span className="text-[#e8c84a]">МАСТЕР</span>
                </div>
                <p className="text-[#444] text-sm font-body leading-relaxed">
                  Производство и установка шкафов-купе на заказ. Работаем по Москве и Московской области.
                </p>
              </div>
            </AnimSection>

            <AnimSection delay={80}>
              <div>
                <div className="text-[11px] font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-5">Контакты</div>
                <div className="space-y-3">
                  {[
                    { icon: "Phone", text: "+7 (495) 000-00-00", href: "tel:+74950000000" },
                    { icon: "Mail", text: "info@kupmaster.ru", href: "mailto:info@kupmaster.ru" },
                    { icon: "MapPin", text: "Москва и Московская область", href: null },
                    { icon: "Clock", text: "Пн–Сб: 9:00–20:00", href: null },
                  ].map(({ icon, text, href }) => (
                    href ? (
                      <a key={text} href={href} className="flex items-start gap-3 text-sm font-body text-[#555] hover:text-[#aaa] transition-colors">
                        <Icon name={icon} size={15} className="text-[#e8c84a] flex-shrink-0 mt-0.5" />
                        <span>{text}</span>
                      </a>
                    ) : (
                      <div key={text} className="flex items-start gap-3 text-sm font-body text-[#555]">
                        <Icon name={icon} size={15} className="text-[#e8c84a] flex-shrink-0 mt-0.5" />
                        <span>{text}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </AnimSection>

            <AnimSection delay={160}>
              <div>
                <div className="text-[11px] font-body uppercase tracking-[0.3em] text-[#e8c84a] mb-5">Навигация</div>
                <div className="space-y-2.5">
                  {[["Преимущества", "advantages"], ["Галерея работ", "gallery"], ["Калькулятор", "calc"], ["Отзывы", "reviews"], ["Оставить заявку", "form"]].map(([label, id]) => (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className="block text-sm text-[#444] font-body hover:text-[#e8c84a] transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </AnimSection>
          </div>

          <div className="mt-12 pt-8 border-t border-[#111] flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs text-[#333] font-body">© 2026 КупеМастер. Все права защищены.</div>
            <button className="text-xs text-[#333] font-body hover:text-[#555] transition-colors">
              Политика конфиденциальности
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
