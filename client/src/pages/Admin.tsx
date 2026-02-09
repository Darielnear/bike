import { useState } from "react";
import { useAdminUser, useAdminLogin, useAdminLogout } from "@/hooks/use-admin";
import { useOrders } from "@/hooks/use-orders";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Loader2, LogOut, Package, Bike } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Login Component
function AdminLogin() {
  const login = useAdminLogin();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(api.admin.login.input)
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-border">
        <h1 className="font-display text-2xl font-bold mb-6 text-center">Admin Access</h1>
        <form onSubmit={handleSubmit((data) => login.mutate(data))} className="space-y-4">
          <div>
            <Input {...register("username")} placeholder="Username" className="premium-input" />
            {errors.username && <p className="text-red-500 text-xs mt-1">{String(errors.username.message)}</p>}
          </div>
          <div>
            <Input type="password" {...register("password")} placeholder="Password" className="premium-input" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{String(errors.password.message)}</p>}
          </div>
          {login.error && <p className="text-red-500 text-sm text-center">Credenziali non valide</p>}
          <button disabled={login.isPending} className="w-full btn-primary h-12">
            {login.isPending ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard() {
  const logout = useAdminLogout();
  const { data: orders, isLoading } = useOrders();
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  return (
    <div className="min-h-screen bg-secondary/10">
      <nav className="bg-white border-b border-border px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <span className="font-display font-bold text-xl">Admin Dashboard</span>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`font-medium transition-colors ${activeTab === 'orders' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Ordini
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`font-medium transition-colors ${activeTab === 'products' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Prodotti
          </button>
          <button onClick={() => logout.mutate()} className="text-destructive hover:bg-destructive/10 p-2 rounded">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Package className="w-6 h-6" /> Gestione Ordini
            </h2>
            
            {isLoading ? <Loader2 className="animate-spin" /> : (
              <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-secondary/30 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                    <tr>
                      <th className="p-4">Ordine</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Stato</th>
                      <th className="p-4">Pagamento</th>
                      <th className="p-4">Totale</th>
                      <th className="p-4">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders?.map(order => (
                      <tr key={order.id} className="hover:bg-secondary/10 transition-colors">
                        <td className="p-4 font-mono font-medium">{order.orderNumber}</td>
                        <td className="p-4">
                          <p className="font-bold">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4 font-bold">{formatCurrency(Number(order.totalAmount))}</td>
                        <td className="p-4">
                          <button className="text-primary hover:underline text-sm font-bold">Gestisci</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
           <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
             <Bike className="w-12 h-12 mb-4 opacity-50" />
             <p>Gestione prodotti in arrivo...</p>
           </div>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const { data: user, isLoading } = useAdminUser();

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  if (!user) return <AdminLogin />;

  return <Dashboard />;
}
