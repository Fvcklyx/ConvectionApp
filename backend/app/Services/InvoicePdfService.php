<?php

namespace App\Services;

use App\Models\{ApplicationSetting, Invoice};
use Barryvdh\DomPDF\Facade\Pdf;

class InvoicePdfService
{
    public function download(Invoice $invoice)
    {
        $invoice->load(['order.customer', 'order.company', 'order.items.product', 'order.payments']);
        $order = $invoice->order;
        $customer = $order->customer;
        $company = $order->company;

        $settingKeys = ['business.company_name', 'business.company_phone', 'business.company_email', 'business.company_address'];
        $settingsMap = ApplicationSetting::whereIn('key', $settingKeys)->pluck('value', 'key');

        $savedName = $settingsMap->get('business.company_name');
        $brandName = is_string($savedName) && trim($savedName) !== '' ? trim($savedName) : 'FRNDLY';

        $savedPhone = $settingsMap->get('business.company_phone');
        $companyPhone = is_string($savedPhone) && trim($savedPhone) !== '' ? trim($savedPhone) : null;

        $savedEmail = $settingsMap->get('business.company_email');
        $companyEmail = is_string($savedEmail) && trim($savedEmail) !== '' ? trim($savedEmail) : null;

        $savedAddress = $settingsMap->get('business.company_address');
        $companyAddress = is_string($savedAddress) && trim($savedAddress) !== '' ? trim($savedAddress) : null;

        $pdf = Pdf::loadView('invoices.pdf', compact('invoice', 'order', 'customer', 'company', 'brandName', 'companyPhone', 'companyEmail', 'companyAddress'))
            ->setPaper('a4');

        return $pdf->download($invoice->invoice_code . '.pdf');
    }
}
