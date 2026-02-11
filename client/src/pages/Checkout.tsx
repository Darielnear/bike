import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CreditCard, Building } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Schema for form validation
const checkoutSchema = z.object({
  customerName: z.string().min(2, "Nome richiesto"),
  customerEmail: z.string().email("Email non valida"),
  customerPhone: z.string().min(8, "Telefono richiesto"),
  address: z.string().min(5, "Indirizzo richiesto"),
  city: z.string().min(2, "Città richiesta"),
  zip: z.string().min(5, "CAP richiesto"),
  province: z.string().min(2, "Provincia richiesta"),
  paymentMethod: z.literal("postepay"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const [, setLocation] = useLocation();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "postepay"
    }
  });

  const paymentMethod = watch("paymentMethod");

  if (items.length === 0) {
    setLocation("/carrello");
    return null;
  }

  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any>(null);

  const onSubmit = (data: CheckoutForm) => {
    const orderData = {
      order: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress: {
          via: data.address,
          città: data.city,
          cap: data.zip,
          provincia: data.province,
        },
        totalAmount: (total() > 500 ? total() : total() + 25).toFixed(2),
        paymentMethod: data.paymentMethod,
      },
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }))
    };

    createOrder.mutate(orderData, {
      onSuccess: (res) => {
        setOrderConfirmed(res);
        setShowPaymentInfo(true);
        clearCart();
      }
    });
  };

  if (showPaymentInfo && orderConfirmed) {
    return (
      <div className="container-padding max-w-2xl mx-auto py-24 text-center">
        <div className="bg-green-50 border border-green-200 p-8 rounded-2xl mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-4">Ordine Ricevuto!</h1>
          <p className="text-green-700">Il tuo ordine #{orderConfirmed.orderNumber} è stato registrato con successo.</p>
        </div>
        
        <div className="bg-white border border-border p-8 rounded-2xl shadow-sm text-left space-y-6">
          <h2 className="text-xl font-bold border-b pb-4">Istruzioni di Pagamento</h2>
          <p className="text-muted-foreground italic">Metodo di Pagamento: Ricarica PostePay / Bonifico su conto BBVA. Per completare l'acquisto, effettua il pagamento a:</p>
          
          <div className="space-y-3 font-mono text-sm bg-secondary/30 p-6 rounded-xl border border-border">
            <p><strong>Intestatario:</strong> Cicli Volante</p>
            <p><strong>IBAN:</strong> IT52 PO35 7601 6010 1000 8072 943</p>
            <p><strong>BIC:</strong> BBVAITM2XXX</p>
            <p><strong>Banca:</strong> BBVA</p>
          </div>
          
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-primary font-medium">
            Importo da pagare: {formatCurrency(Number(orderConfirmed.totalAmount))}
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            Inserire il numero d'ordine <strong>#{orderConfirmed.orderNumber}</strong> come causale. 
            La spedizione avverrà dopo la ricezione del pagamento.
          </p>
        </div>
        
        <Link href="/" className="inline-block mt-12 btn-primary">
          Torna alla Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container-padding max-w-4xl mx-auto py-12 md:py-24">
      <h1 className="font-display text-3xl font-bold mb-12 text-center">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Contact Info */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4">
              <h2 className="text-xl font-bold mb-4">Dati di contatto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input {...register("customerName")} className="premium-input" placeholder="Mario Rossi" />
                  {errors.customerName && <p className="text-red-500 text-xs">{errors.customerName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Telefono</Label>
                  <Input {...register("customerPhone")} className="premium-input" placeholder="+39 ..." />
                  {errors.customerPhone && <p className="text-red-500 text-xs">{errors.customerPhone.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Email</Label>
                  <Input {...register("customerEmail")} className="premium-input" placeholder="mario@example.com" />
                  {errors.customerEmail && <p className="text-red-500 text-xs">{errors.customerEmail.message}</p>}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4">
              <h2 className="text-xl font-bold mb-4">Indirizzo di Spedizione</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Indirizzo e civico</Label>
                  <Input {...register("address")} className="premium-input" placeholder="Via Roma 1" />
                  {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>CAP</Label>
                    <Input {...register("zip")} className="premium-input" placeholder="00100" />
                    {errors.zip && <p className="text-red-500 text-xs">{errors.zip.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Città</Label>
                    <Input {...register("city")} className="premium-input" placeholder="Roma" />
                    {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Provincia</Label>
                    <Input {...register("province")} className="premium-input" placeholder="RM" />
                    {errors.province && <p className="text-red-500 text-xs">{errors.province.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4">
              <h2 className="text-xl font-bold mb-4">Metodo di Pagamento</h2>
              <div className="grid gap-4">
                <div className="flex flex-col items-center justify-between rounded-xl border-2 p-4 border-primary bg-secondary/30">
                  <CreditCard className="mb-3 h-6 w-6" />
                  <span className="font-bold">Ricarica Postepay</span>
                  <span className="text-xs text-muted-foreground mt-1">Veloce e sicuro</span>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
                <strong>Nota:</strong> Il pagamento verrà effettuato manualmente dopo la conferma dell'ordine. Riceverai le coordinate via email.
              </div>
            </div>

            <button 
              type="submit" 
              disabled={createOrder.isPending}
              className="w-full btn-primary h-14 text-lg"
            >
              {createOrder.isPending ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Conferma Ordine"}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="bg-secondary/20 p-6 rounded-xl border border-border sticky top-24">
            <h3 className="font-bold mb-4 text-lg">I tuoi articoli</h3>
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 text-sm">
                  <div className="w-16 h-16 bg-white rounded border border-border overflow-hidden shrink-0">
                    <img src={item.product.mainImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{item.product.name}</p>
                    <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="font-medium">{formatCurrency(Number(item.product.price) * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotale</span>
                <span>{formatCurrency(total())}</span>
              </div>
              <div className="flex justify-between">
                <span>Spedizione</span>
                <span>{total() > 500 ? 'Gratis' : '€ 25,00'}</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-2 border-t border-border mt-2">
                <span>Totale</span>
                <span>{formatCurrency(total() > 500 ? total() : total() + 25)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
