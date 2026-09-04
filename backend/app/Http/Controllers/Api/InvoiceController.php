<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Services\CodeGeneratorService;
use App\Traits\ScopesByCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class InvoiceController extends Controller
{
    use ScopesByCompany;

    private const INVOICE_STATUSES = ['draft', 'issued', 'paid'];

    public function index(Request $request): JsonResponse
    {
        $query = Invoice::query()->with(['order.customer', 'order.items.product', 'order.payments']);

        $companyId = $this->companyId($request);

        if ($companyId !== null) {
            $query->whereHas('order', fn ($orders) => $orders->where('company_id', $companyId));
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate($this->perPage($request)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'total_amount' => 'required|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'status' => 'prohibited',
        ]);

        $order = \App\Models\Order::findOrFail($data['order_id']);

        $this->assertSameCompany($order->company_id, $request);

        $totalAmount = (float) $data['total_amount'];

        // paid_amount opsional dari klien; jika tidak dikirim, turunkan dari pembayaran order.
        $paidAmount = isset($data['paid_amount'])
            ? (float) $data['paid_amount']
            : (float) $order->paid_amount;

        $this->assertInvoiceAmounts($totalAmount, $paidAmount);

        // Invoice tidak dapat lahir lunas tanpa pembayaran aktual pada order.
        if ($paidAmount >= $totalAmount && (float) $order->paid_amount < $totalAmount) {
            throw ValidationException::withMessages([
                'paid_amount' => ['Status paid hanya dapat dicapai melalui pembayaran aktual pada order.'],
            ]);
        }

        $invoice = Invoice::create([
            'order_id' => $data['order_id'],
            'invoice_code' => CodeGeneratorService::invoiceNumber(),
            'total_amount' => $totalAmount,
            'paid_amount' => $paidAmount,
            'outstanding_amount' => max(0, $totalAmount - $paidAmount),
            'status' => $paidAmount >= $totalAmount ? 'paid' : 'draft',
        ]);

        $invoice->load(['order.customer', 'order.items.product', 'order.payments']);

        return response()->json([
            'success' => true,
            'data' => $invoice,
        ], 201);
    }

    public function show(Invoice $invoice): JsonResponse
    {
        $invoice->load(['order.customer', 'order.items.product', 'order.payments']);

        $this->assertSameCompany($invoice->order->company_id, request());

        return response()->json([
            'success' => true,
            'data' => $invoice,
        ]);
    }

    public function pdf(Invoice $invoice)
    {
        $invoice->load(['order.customer', 'order.company', 'order.items.product', 'order.payments']);

        $this->assertSameCompany($invoice->order->company_id, request());

        return app(\App\Services\InvoicePdfService::class)->download($invoice);
    }

    public function update(Request $request, Invoice $invoice): JsonResponse
    {
        $this->authorize('update', $invoice);

        $invoice->load('order');

        $this->assertSameCompany($invoice->order->company_id, $request);

        $data = $request->validate([
            'total_amount' => 'sometimes|numeric|min:0',
        ]);

        $totalAmount = $data['total_amount'] ?? $invoice->total_amount;
        $paidAmount = (float) $invoice->order->fresh()->paid_amount;

        $this->assertInvoiceAmounts($totalAmount, $paidAmount);

        $data['paid_amount'] = $paidAmount;
        $data['outstanding_amount'] = max(0, $totalAmount - $paidAmount);
        $data['status'] = $paidAmount >= (float) $totalAmount ? 'paid' : ($invoice->status === 'paid' ? 'issued' : $invoice->status);

        $invoice->update($data);

        $invoice->load(['order.customer', 'order.items.product', 'order.payments']);

        return response()->json([
            'success' => true,
            'data' => $invoice,
        ]);
    }

    private function assertInvoiceAmounts(float|int|string $totalAmount, float|int|string $paidAmount): void
    {
        if ((float) $paidAmount > (float) $totalAmount) {
            throw ValidationException::withMessages([
                'paid_amount' => ['Pembayaran pada invoice tidak boleh melebihi total invoice.'],
            ]);
        }
    }

    public function destroy(Invoice $invoice): JsonResponse
    {
        $this->authorize('delete', $invoice);

        $invoice->load('order');

        $this->assertSameCompany($invoice->order->company_id, request());

        $invoice->delete();

        return response()->json([
            'success' => true,
            'message' => 'Invoice dihapus.',
        ]);
    }
}
