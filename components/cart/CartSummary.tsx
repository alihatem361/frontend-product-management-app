interface Props {
  total: number;
  discountedTotal: number;
  totalQuantity: number;
}

export function CartSummary({ total, discountedTotal, totalQuantity }: Props) {
  const savings = (total - discountedTotal).toFixed(2);

  return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-white/10 sticky top-20">
      <h2 className="text-xl font-semibold mb-4">ملخص الطلب</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-slate-400">
          <span>عدد المنتجات</span>
          <span>{totalQuantity}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>السعر الأصلي</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-400">
          <span>الخصم</span>
          <span>-${savings}</span>
        </div>
        <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-xl">
          <span>الإجمالي النهائي</span>
          <span>${discountedTotal.toFixed(2)}</span>
        </div>
      </div>

      <button className="w-full bg-violet-600 text-white py-3 rounded-lg font-bold hover:bg-violet-700 transition">
        إتمام عملية الشراء
      </button>
    </div>
  );
}
