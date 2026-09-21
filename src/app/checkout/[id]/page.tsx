"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Banknote,
  Building2,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Phone,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { sendToDeliveriesBackend } from "@/services/api/postDelivery";
import type { Product } from "@/types/product";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type PaymentMethod = "bkash" | "rocket" | "bank";

export default function CheckoutPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = params?.id;
  const { data: session, isPending: isAuthPending } = authClient.useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash");
  const [selectedColor, setSelectedColor] = useState(searchParams.get("color") || "");
  const [quantity, setQuantity] = useState(1);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentNumber: "",
    transactionId: "",
    bankName: "",
    bankAccountId: "",
    accountHolder: "",
  });

  useEffect(() => {
    if (!isAuthPending && !session) {
      router.replace(`/login?redirect=/checkout/${productId}`);
      return;
    }

    if (session?.user) {
      const nameParts = (session.user.name || "").trim().split(/\s+/).filter(Boolean);
      setForm((current) => ({
        ...current,
        firstName: current.firstName || nameParts[0] || "",
        lastName: current.lastName || nameParts.slice(1).join(" "),
        email: current.email || session.user.email || "",
      }));
    }
  }, [session, isAuthPending, productId, router]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_BASE_URL}/api/v1/furniture/${productId}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok || !data?.success || !data?.data) {
          throw new Error(data?.error || "Product not found");
        }
        setProduct(data.data);
        if (data.data.colors?.length) {
          setSelectedColor((current) => current || data.data.colors[0].name);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const subtotal = useMemo(() => Number(product?.price || 0) * quantity, [product, quantity]);
  const deliveryFee = Number(product?.deliveryFee || 0);
  const total = subtotal + deliveryFee;

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const validatePayment = () => {
    if (paymentMethod === "bkash" || paymentMethod === "rocket") {
      if (!form.paymentNumber.trim() || !form.transactionId.trim()) {
        return "Please enter the payment number and transaction ID.";
      }
    }

    if (paymentMethod === "bank") {
      if (!form.bankName.trim() || !form.bankAccountId.trim() || !form.accountHolder.trim() || !form.transactionId.trim()) {
        return "Please complete the bank payment information.";
      }
    }

    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!session?.user?.id || !product) {
      setError("Please log in before placing the order.");
      return;
    }

    if (!form.firstName.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim()) {
      setError("Please complete your contact and delivery information.");
      return;
    }

    const paymentError = validatePayment();
    if (paymentError) {
      setError(paymentError);
      return;
    }

    setSubmitting(true);

    const payload = {
      userId: session.user.id,
      userName: `${form.firstName} ${form.lastName}`.trim(),
      userEmail: form.email,
      phone: form.phone,
      productId: product._id,
      title: product.title,
      price: Number(product.price),
      quantity,
      subtotal,
      deliveryFee,
      total,
      image: product.image,
      color: selectedColor || "Default",
      shippingAddress: {
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
      },
      payment: {
        method: paymentMethod,
        paymentNumber: paymentMethod === "bank" ? undefined : form.paymentNumber,
        transactionId: form.transactionId,
        bankName: paymentMethod === "bank" ? form.bankName : undefined,
        bankAccountId: paymentMethod === "bank" ? form.bankAccountId : undefined,
        accountHolder: paymentMethod === "bank" ? form.accountHolder : undefined,
        status: "Submitted",
      },
    };

    try {
      const ok = await sendToDeliveriesBackend(payload);
      if (!ok) throw new Error("The server could not save your order.");
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/user/orders"), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order placement failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthPending || loading) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] pt-28 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-stone-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Preparing secure checkout...
        </div>
      </main>
    );
  }

  if (error && !product) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] pt-32 px-6 text-center">
        <h1 className="font-serif text-3xl text-stone-950">Checkout unavailable</h1>
        <p className="mt-3 text-sm text-stone-500">{error}</p>
        <button onClick={() => router.back()} className="mt-6 rounded-full bg-stone-950 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white">Go Back</button>
      </main>
    );
  }

  if (!product) return null;

  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-24 pb-16 text-stone-950">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-stone-500 transition hover:text-stone-950">
          <ArrowLeft className="h-4 w-4" /> Back to product
        </button>

        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9d155f]">Secure checkout</p>
          <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">Complete your order</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">Enter your delivery information and choose a payment method to place your furniture order.</p>
        </div>

        {success ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-20 max-w-xl rounded-3xl border border-emerald-200 bg-white p-10 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
            <h2 className="mt-5 font-serif text-3xl">Order placed successfully</h2>
            <p className="mt-2 text-sm text-stone-500">Your payment information has been submitted. Redirecting to your orders...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-stone-100"><UserRound className="h-5 w-5" /></div>
                  <div><h2 className="font-serif text-2xl">Contact details</h2><p className="text-xs text-stone-500">We will use these details for order updates.</p></div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="First name" value={form.firstName} onChange={(value) => updateField("firstName", value)} required />
                  <Field label="Last name" value={form.lastName} onChange={(value) => updateField("lastName", value)} />
                  <Field label="Email" type="email" value={form.email} onChange={(value) => updateField("email", value)} required />
                  <Field label="Phone number" value={form.phone} onChange={(value) => updateField("phone", value)} required icon={<Phone className="h-4 w-4" />} />
                </div>
              </section>

              <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-stone-100"><MapPin className="h-5 w-5" /></div>
                  <div><h2 className="font-serif text-2xl">Delivery address</h2><p className="text-xs text-stone-500">Where should we deliver your furniture?</p></div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2"><Field label="Full address" value={form.address} onChange={(value) => updateField("address", value)} required /></div>
                  <Field label="City / Area" value={form.city} onChange={(value) => updateField("city", value)} required />
                  <Field label="Postal code" value={form.postalCode} onChange={(value) => updateField("postalCode", value)} />
                </div>
              </section>

              <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-stone-100"><CreditCard className="h-5 w-5" /></div>
                  <div><h2 className="font-serif text-2xl">Payment method</h2><p className="text-xs text-stone-500">Choose one payment option and provide the payment reference.</p></div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <PaymentOption active={paymentMethod === "bkash"} label="bKash" icon={<Banknote className="h-5 w-5" />} onClick={() => setPaymentMethod("bkash")} />
                  <PaymentOption active={paymentMethod === "rocket"} label="Rocket" icon={<Rocket className="h-5 w-5" />} onClick={() => setPaymentMethod("rocket")} />
                  <PaymentOption active={paymentMethod === "bank"} label="Bank" icon={<Building2 className="h-5 w-5" />} onClick={() => setPaymentMethod("bank")} />
                </div>

                <div className="mt-5 rounded-2xl bg-[#faf8f5] p-4 sm:p-5">
                  {paymentMethod === "bkash" && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="bKash number" placeholder="01XXXXXXXXX" value={form.paymentNumber} onChange={(value) => updateField("paymentNumber", value)} required />
                      <Field label="Transaction ID" placeholder="e.g. 9AB12CD34" value={form.transactionId} onChange={(value) => updateField("transactionId", value)} required />
                    </div>
                  )}

                  {paymentMethod === "rocket" && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Rocket number" placeholder="01XXXXXXXXX" value={form.paymentNumber} onChange={(value) => updateField("paymentNumber", value)} required />
                      <Field label="Transaction ID" placeholder="e.g. RKT123456" value={form.transactionId} onChange={(value) => updateField("transactionId", value)} required />
                    </div>
                  )}

                  {paymentMethod === "bank" && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Bank name" value={form.bankName} onChange={(value) => updateField("bankName", value)} required />
                      <Field label="Bank account / ID" value={form.bankAccountId} onChange={(value) => updateField("bankAccountId", value)} required />
                      <Field label="Account holder" value={form.accountHolder} onChange={(value) => updateField("accountHolder", value)} required />
                      <Field label="Transaction ID" value={form.transactionId} onChange={(value) => updateField("transactionId", value)} required />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /> Payment references are submitted with the order for verification. This form does not process a live bank or mobile-financial-service transaction.
                </div>
              </section>

              {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="font-serif text-2xl">Order summary</h2>
                <div className="mt-5 flex gap-4 border-b border-stone-100 pb-5">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#f4f0eb]">
                    <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-stone-400">{product.category || "Furniture"}</p>
                    <h3 className="mt-1 line-clamp-2 font-serif text-lg leading-6">{product.title}</h3>
                    <p className="mt-2 text-sm font-semibold">${Number(product.price).toFixed(2)}</p>
                  </div>
                </div>

                {product.colors?.length ? (
                  <div className="mt-5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Colour</label>
                    <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-500">
                      {product.colors.map((color) => <option key={color.name} value={color.name}>{color.name}</option>)}
                    </select>
                  </div>
                ) : null}

                <div className="mt-4">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Quantity</label>
                  <div className="mt-2 flex h-11 items-center justify-between rounded-xl border border-stone-200 px-2">
                    <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="h-8 w-8 rounded-lg hover:bg-stone-100">−</button>
                    <span className="text-sm font-medium">{quantity}</span>
                    <button type="button" onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))} className="h-8 w-8 rounded-lg hover:bg-stone-100">+</button>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-stone-500"><span>Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
                  <div className="flex justify-between border-t border-stone-200 pt-4 text-base font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </div>

                <button type="submit" disabled={submitting || product.stock === 0} className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#9d155f] px-6 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#7d0f4a] disabled:cursor-not-allowed disabled:bg-stone-300">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
                  {submitting ? "Placing order..." : "Place Order"}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-stone-400"><Package className="h-3.5 w-3.5" /> Estimated delivery 3–5 days</div>
              </section>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">{label}{required ? " *" : ""}</span>
      <div className="relative">
        {icon ? <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">{icon}</span> : null}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`h-12 w-full rounded-xl border border-stone-200 bg-white text-sm outline-none transition placeholder:text-stone-300 focus:border-stone-500 ${icon ? "pl-10 pr-3" : "px-3"}`}
        />
      </div>
    </label>
  );
}

function PaymentOption({ active, label, icon, onClick }: { active: boolean; label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`flex h-16 items-center justify-center gap-2 rounded-2xl border text-sm font-semibold transition ${active ? "border-[#9d155f] bg-[#fff4f9] text-[#9d155f] shadow-sm" : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"}`}>
      {icon}{label}
    </button>
  );
}
