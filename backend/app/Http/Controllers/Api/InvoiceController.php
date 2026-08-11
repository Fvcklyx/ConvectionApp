<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApplicationSetting;
use App\Models\Invoice;
use App\Services\CodeGeneratorService;
use App\Traits\ScopesByCompany;
use Barryvdh\DomPDF\Facade\Pdf;
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
            'status' => 'nullable|string|in:' . implode(',', self::INVOICE_STATUSES),
        ]);

        $order = \App\Models\Order::findOrFail($data['order_id']);

        $this->assertSameCompany($order->company_id, $request);

        $paidAmount = $data['paid_amount'] ?? 0;

        $this->assertInvoiceAmounts($data['total_amount'], $paidAmount);

        $invoice = Invoice::create([
            'order_id' => $data['order_id'],
            'invoice_code' => CodeGeneratorService::invoiceNumber(),
            'total_amount' => $data['total_amount'],
            'paid_amount' => $paidAmount,
            'outstanding_amount' => max(0, $data['total_amount'] - $paidAmount),
            'status' => $data['status'] ?? 'draft',
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

        $order = $invoice->order;
        $customer = $order->customer;
        $company = $order->company;

        $savedName = ApplicationSetting::where('key', 'business.company_name')->value('value');
        $brandName = is_string($savedName) && trim($savedName) !== '' ? trim($savedName) : 'FRNDLY';

        $savedPhone = ApplicationSetting::where('key', 'business.company_phone')->value('value');
        $companyPhone = is_string($savedPhone) && trim($savedPhone) !== '' ? trim($savedPhone) : null;

        $savedEmail = ApplicationSetting::where('key', 'business.company_email')->value('value');
        $companyEmail = is_string($savedEmail) && trim($savedEmail) !== '' ? trim($savedEmail) : null;

        $savedAddress = ApplicationSetting::where('key', 'business.company_address')->value('value');
        $companyAddress = is_string($savedAddress) && trim($savedAddress) !== '' ? trim($savedAddress) : null;

        $pdf = Pdf::loadView('invoices.pdf', compact('invoice', 'order', 'customer', 'company', 'brandName', 'companyPhone', 'companyEmail', 'companyAddress'))
            ->setPaper('a4');

        return $pdf->download($invoice->invoice_code . '.pdf');
    }

    public function update(Request $request, Invoice $invoice): JsonResponse
    {
        $this->authorize('update', $invoice);

        $invoice->load('order');

        $this->assertSameCompany($invoice->order->company_id, $request);

        $data = $request->validate([
            'total_amount' => 'sometimes|numeric|min:0',
            'paid_amount' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|string|in:' . implode(',', self::INVOICE_STATUSES),
        ]);

        $totalAmount = $data['total_amount'] ?? $invoice->total_amount;
        $paidAmount = $data['paid_amount'] ?? $invoice->paid_amount;

        $this->assertInvoiceAmounts($totalAmount, $paidAmount);

        $data['outstanding_amount'] = max(0, $totalAmount - $paidAmount);

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
