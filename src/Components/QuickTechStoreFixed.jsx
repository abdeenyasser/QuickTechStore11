import{ useState, useMemo } from "react";
import { ShoppingCart, Search, X, Plus, Minus, Trash2, CheckCircle, AlertCircle, Monitor, Headphones, Keyboard, Mouse, RotateCcw } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "شاشة جيمنج منحنية 27 بوصة 165Hz", category: "شاشات", price: 8500, badge: "الأكثر مبيعاً", icon: "monitor" },
  { id: 2, name: "لوحة مفاتيح ميكانيكية RGB بإضاءة خلفية", category: "إكسسوارات", price: 1450, badge: "جديد", icon: "keyboard" },
  { id: 3, name: "سماعة رأس محيطية 7.1 للألعاب والعمل", category: "صوتيات", price: 1900, badge: "", icon: "headphones" },
  { id: 4, name: "ماوس لاسلكي احترافي فائق الخفة", category: "إكسسوارات", price: 1100, badge: "خصم", icon: "mouse" },
  { id: 5, name: "شاشة IPS احترافية للتصميم 24 بوصة", category: "شاشات", price: 6200, badge: "", icon: "monitor" },
  { id: 6, name: "مايكروفون بودكاست USB مع حامل مكتبي", category: "صوتيات", price: 2300, badge: "مميز", icon: "headphones" },
];

const CATEGORIES = ["الكل", "شاشات", "إكسسوارات", "صوتيات"];

export default function QuickTechStoreFixed() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Contact Form State & Errors
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // FIX 1: Clean combined filtering with useMemo
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === "الكل" || product.category === selectedCategory;
      const matchesSearch = query === "" || product.name.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory("الكل");
    setSearchQuery("");
  };

  // FIX 3: Merge duplicate products in cart and handle quantity updates cleanly
  const addToCart = (product) => {
    setCheckoutSuccess(false);
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const subtotalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const shippingCost = subtotalPrice > 0 ? (subtotalPrice >= 5000 ? 0 : 75) : 0;
  const finalTotal = subtotalPrice + shippingCost;

  // FIX 4: Validate form fields before submitting
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "يرجى إدخال الاسم بالكامل.";
    }
    if (!formData.phone.trim()) {
      errors.phone = "يرجى إدخال رقم الهاتف.";
    } else if (!/^01[0-2,5]{1}[0-9]{8}$/.test(formData.phone.trim())) {
      errors.phone = "يرجى إدخال رقم هاتف مصري صحيح مكون من 11 رقماً.";
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = "يرجى كتابة تفاصيل الرسالة (10 أحرف على الأقل).";
    }
    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSubmitted(false);
      return;
    }
    setSubmitted(true);
    setFormData({ name: "", phone: "", message: "" });
  };

  const renderIcon = (type) => {
    switch (type) {
      case "monitor": return <Monitor className="w-14 h-14 text-blue-600" />;
      case "keyboard": return <Keyboard className="w-14 h-14 text-indigo-600" />;
      case "headphones": return <Headphones className="w-14 h-14 text-purple-600" />;
      default: return <Mouse className="w-14 h-14 text-emerald-600" />;
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              Q
            </div>
            <h1 className="text-xl font-bold text-slate-900">متجر التقنية السريع</h1>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span className="font-medium">السلة</span>
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-l from-blue-700 to-indigo-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">أحدث إكسسوارات الكمبيوتر والشاشات</h2>
          <p className="text-blue-100 max-w-xl text-sm sm:text-base">
            تشكيلة مختارة بأفضل الأسعار مع شحن مجاني للطلبات فوق 5,000 ج.م.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-8">
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full pr-10 pl-9 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="مسح البحث"
                className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (cat === "الكل") setSearchQuery("");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FIX 2: Responsive Product Grid with aligned cards */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <p className="text-slate-600 font-medium mb-4">لا توجد منتجات مطابقة لبحثك الحالي.</p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>عرض جميع المنتجات</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                    {product.badge && (
                      <span className="absolute top-2.5 right-2.5 bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {product.badge}
                      </span>
                    )}
                    {renderIcon(product.icon)}
                  </div>
                  <span className="text-xs text-blue-600 font-semibold">{product.category}</span>
                  <h3 className="font-bold text-base text-slate-900 mt-1 leading-snug">
                    {product.name}
                  </h3>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="font-bold text-slate-900 text-base">
                    {product.price.toLocaleString()} ج.م
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-medium px-4 py-2 rounded-lg transition cursor-pointer"
                  >
                    أضف للسلة
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact / Order Form */}
        <section className="mt-16 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto shadow-sm">
          <h3 className="text-xl font-bold mb-2">تواصل معنا أو اطلب استفساراً خاصاً</h3>
          <p className="text-slate-500 text-sm mb-6">اترك بياناتك وسيتواصل معك فريق المبيعات في أقرب وقت.</p>

          {submitted && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">الاسم بالكامل</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (formErrors.name) setFormErrors({ ...formErrors, name: "" });
                }}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none ${
                  formErrors.name ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-blue-500"
                }`}
                placeholder="أدخل اسمك"
              />
              {formErrors.name && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formErrors.name}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" });
                }}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none ${
                  formErrors.phone ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-blue-500"
                }`}
                placeholder="01xxxxxxxxx"
              />
              {formErrors.phone && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formErrors.phone}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">تفاصيل الطلب أو الرسالة</label>
              <textarea
                rows="3"
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (formErrors.message) setFormErrors({ ...formErrors, message: "" });
                }}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none ${
                  formErrors.message ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-blue-500"
                }`}
                placeholder="اكتب رسالتك هنا..."
              />
              {formErrors.message && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formErrors.message}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer"
            >
              إرسال الطلب
            </button>
          </form>
        </section>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 flex flex-col justify-between shadow-xl">
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-lg font-bold">سلة المشتريات ({totalItems})</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 flex-1 overflow-y-auto pl-1">
                {checkoutSuccess ? (
                  <div className="text-center py-12 px-4">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <h4 className="font-bold text-lg text-slate-900">تم تأكيد طلبك بنجاح!</h4>
                    <p className="text-sm text-slate-500 mt-1">شكراً لتسوقك من متجر التقنية السريع.</p>
                  </div>
                ) : cart.length === 0 ? (
                  <p className="text-slate-500 text-center py-12">السلة فارغة حالياً</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 border-b pb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-slate-900">{item.name}</p>
                        <p className="text-xs text-blue-600 font-medium mt-0.5">
                          {(item.price * item.quantity).toLocaleString()} ج.م
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 rounded text-red-500 hover:bg-red-50 flex items-center justify-center mr-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>المجموع الفرعي:</span>
                  <span>{subtotalPrice.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>الشحن:</span>
                  <span>{shippingCost === 0 ? "مجاني" : `${shippingCost} ج.م`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-slate-900 pt-2 border-t">
                  <span>الإجمالي الكلي:</span>
                  <span>{finalTotal.toLocaleString()} ج.م</span>
                </div>
                <button
                  onClick={() => {
                    setCart([]);
                    setCheckoutSuccess(true);
                  }}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition cursor-pointer"
                >
                  إتمام الطلب
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
