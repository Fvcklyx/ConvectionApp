<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApplicationSetting;
use App\Models\Invoice;
use App\Services\CodeGeneratorService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    private const INVOICE_STATUSES = ['draft', 'issued', 'paid'];

    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Invoice::with(['order.customer', 'order.items.product', 'order.payments'])->latest()->paginate(20),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'total_amount' => 'required|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'outstanding_amount' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:' . implode(',', self::INVOICE_STATUSES),
        ]);

        $invoice = Invoice::create([
            'order_id' => $data['order_id'],
            'invoice_code' => CodeGeneratorService::invoiceNumber(),
            'total_amount' => $data['total_amount'],
            'paid_amount' => $data['paid_amount'] ?? 0,
            'outstanding_amount' => $data['outstanding_amount'] ?? max(0, $data['total_amount'] - ($data['paid_amount'] ?? 0)),
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

        return response()->json([
            'success' => true,
            'data' => $invoice,
        ]);
    }

    public function pdf(Invoice $invoice)
    {
        $invoice->load(['order.customer', 'order.company', 'order.items.product', 'order.payments']);

        $order = $invoice->order;
        $customer = $order->customer;
        $company = $order->company;

        $savedName = ApplicationSetting::where('key', 'business.company_name')->value('value');
        $brandName = is_string($savedName) && trim($savedName) !== '' ? trim($savedName) : 'FRNDLY';

        $pdf = Pdf::loadView('invoices.pdf', compact('invoice', 'order', 'customer', 'company', 'brandName'))
            ->setPaper('a4');

        return $pdf->download($invoice->invoice_code . '.pdf');
    }

    public function update(Request $request, Invoice $invoice): JsonResponse
    {
        $data = $request->validate([
            'total_amount' => 'sometimes|numeric|min:0',
            'paid_amount' => 'sometimes|numeric|min:0',
            'outstanding_amount' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|string|in:' . implode(',', self::INVOICE_STATUSES),
        ]);

        $invoice->update($data);

        $invoice->load(['order.customer', 'order.items.product', 'order.payments']);

        return response()->json([
            'success' => true,
            'data' => $invoice,
        ]);
    }

    public function destroy(Invoice $invoice): JsonResponse
    {
        $invoice->delete();

        return response()->json([
            'success' => true,
            'message' => 'Invoice dihapus.',
        ]);
    }
}
