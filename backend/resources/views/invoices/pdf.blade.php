<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_code }}</title>
    <style>
        @page {
            margin: 18mm 16mm;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10.5px;
            color: #1b2430;
            line-height: 1.45;
        }

        .brand-color {
            color: {{ $company->primary_color ?? '#5b5bd6' }};
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid {{ $company->primary_color ?? '#5b5bd6' }};
            padding-bottom: 12px;
            margin-bottom: 14px;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .brand-logo {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: {{ $company->primary_color ?? '#5b5bd6' }};
            color: #ffffff;
            font-size: 20px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .brand-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 8px;
        }

        .brand-name {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: .02em;
        }

        .brand-sub {
            font-size: 10px;
            color: #667085;
        }

        .doc-title {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: .08em;
            text-transform: uppercase;
        }

        .doc-meta {
            text-align: right;
            font-size: 10.5px;
            color: #344054;
        }

        .doc-meta .code {
            font-size: 13px;
            font-weight: 700;
            color: #1b2430;
        }

        .company-box {
            background: #f6f7fb;
            border: 1px solid #e4e8f0;
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 14px;
            font-size: 10px;
            color: #344054;
        }

        .grid {
            width: 100%;
            margin-bottom: 14px;
        }

        .grid td {
            vertical-align: top;
            padding: 0 8px 8px 0;
            font-size: 10.5px;
        }

        .grid .label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: .06em;
            color: #667085;
            margin-bottom: 2px;
        }

        .grid .value {
            font-weight: 700;
            color: #1b2430;
        }

        .section-title {
            font-size: 9.5px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .08em;
            color: #667085;
            margin: 16px 0 6px;
        }

        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        table.items th {
            background: #f1f2f8;
            color: #344054;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: .06em;
            padding: 7px 8px;
            text-align: left;
            border-bottom: 1px solid #e4e8f0;
        }

        table.items td {
            padding: 7px 8px;
            border-bottom: 1px solid #eef0f5;
            vertical-align: top;
            font-size: 10px;
        }

        table.items .num {
            text-align: right;
            white-space: nowrap;
        }

        table.items .prod-name {
            font-weight: 700;
        }

        table.items .detail {
            font-size: 9px;
            color: #667085;
        }

        table.totals {
            width: 46%;
            margin-left: auto;
            border-collapse: collapse;
        }

        table.totals td {
            padding: 4px 8px;
            font-size: 10.5px;
        }

        table.totals .label {
            color: #667085;
        }

        table.totals .num {
            text-align: right;
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
        }

        table.totals .grand td {
            font-size: 13px;
            font-weight: 700;
            border-top: 2px solid {{ $company->primary_color ?? '#5b5bd6' }};
            padding-top: 7px;
        }

        .payment-note {
            background: #f0fdf6;
            border: 1px solid #d6f2e3;
            border-radius: 8px;
            padding: 9px 12px;
            font-size: 10px;
            color: #067647;
            margin: 4px 0 0;
        }

        .notes {
            margin-top: 16px;
            padding-top: 10px;
            border-top: 1px solid #e4e8f0;
            font-size: 9.5px;
            color: #667085;
        }

        .footer {
            position: fixed;
            bottom: -13mm;
            left: 16mm;
            right: 16mm;
            text-align: center;
            font-size: 9px;
            color: #667085;
            border-top: 1px solid #e4e8f0;
            padding-top: 6px;
        }

        .thanks {
            text-align: center;
            font-size: 11px;
            font-weight: 700;
            color: {{ $company->primary_color ?? '#5b5bd6' }};
            margin-top: 18px;
        }
    </style>
</head>
<body>
    @php
        if (! function_exists('rupiah')) {
            function rupiah($value)
            {
                return 'Rp' . number_format((float) $value, 0, ',', '.');
            }
        }

        if (! function_exists('tanggal')) {
            function tanggal($date)
            {
                if (empty($date)) {
                    return '-';
                }

                $months = [
                    1 => 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
                ];
                $parsed = \Carbon\Carbon::parse($date);

                return $parsed->day . ' ' . $months[(int) $parsed->month] . ' ' . $parsed->year;
            }
        }

        $orderStatusLabels = [
            'draft' => 'Draft',
            'waiting_dp' => 'Menunggu DP',
            'dp_received' => 'DP Masuk',
            'processing' => 'Proses',
            'paid' => 'Lunas',
        ];
    @endphp

    <div class="header">
        <div class="brand">
            <div class="brand-logo">
                @php
                    $logoDisk = \Illuminate\Support\Facades\Storage::disk('public');
                    $logoData = ($company && $company->logo_path && $logoDisk->exists($company->logo_path))
                        ? $logoDisk->get($company->logo_path)
                        : null;
                    $logoExt = $company ? pathinfo($company->logo_path ?? '', PATHINFO_EXTENSION) : '';
                @endphp
                @if ($logoData && in_array(strtolower($logoExt), ['jpeg', 'jpg', 'png', 'webp'], true))
                    <img src="{{ 'data:image/' . strtolower($logoExt) . ';base64,' . base64_encode($logoData) }}" alt="Logo">
                @else
                    F
                @endif
            </div>
            <div>
                <div class="brand-name">{{ $brandName }}</div>
                <div class="brand-sub">ConvectionApp</div>
            </div>
        </div>
        <div class="doc-meta">
            <div class="doc-title">INVOICE</div>
            <div class="code">{{ $invoice->invoice_code }}</div>
            <div>Tanggal: {{ tanggal($invoice->created_at) }}</div>
        </div>
    </div>

    @if ($companyAddress || $companyPhone || $companyEmail)
        <div class="company-box">
            <strong>{{ $brandName }}</strong>
            @if ($companyAddress) &nbsp;|&nbsp; {{ $companyAddress }}@endif
            @if ($companyPhone) &nbsp;|&nbsp; Telp: {{ $companyPhone }}@endif
            @if ($companyEmail) &nbsp;|&nbsp; {{ $companyEmail }}@endif
        </div>
    @endif

    <table class="grid">
        <tr>
            <td style="width:50%">
                <div class="label">Tagihan untuk</div>
                <div class="value">{{ $customer?->name ?? '-' }}</div>
                @if ($customer?->phone) <div>{{ $customer->phone }}</div> @endif
                @if ($customer?->email) <div>{{ $customer->email }}</div> @endif
                @if ($customer?->address)
                    <div>{{ $customer->address }}{{ $customer->city ? ', ' . $customer->city : '' }}{{ $customer->province ? ', ' . $customer->province : '' }}</div>
                @endif
            </td>
            <td style="width:50%">
                <div class="label">Informasi Order</div>
                <div class="value">{{ $order->order_code }}</div>
                <div>Tanggal order: {{ tanggal($order->created_at) }}</div>
                <div>Status order: {{ $orderStatusLabels[$order->status] ?? $order->status }}</div>
                @if ($order->deadline) <div>Deadline: {{ tanggal($order->deadline) }}</div> @endif
            </td>
        </tr>
    </table>

    <div class="section-title">Detail Item</div>
    <table class="items">
        <thead>
            <tr>
                <th style="width:6%">No</th>
                <th style="width:34%">Produk</th>
                <th style="width:22%">Detail</th>
                <th style="width:10%" class="num">Qty</th>
                <th style="width:14%" class="num">Harga Satuan</th>
                <th style="width:14%" class="num">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($order->items as $index => $item)
                @php
                    $detail = [];
                    $variant = is_array($item->variant_snapshot) ? $item->variant_snapshot : [];
                    if (! empty($variant)) {
                        $detail[] = implode(' | ', array_filter(array_map('strval', $variant)));
                    }
                    if ($item->product) {
                        if ($item->product->color) {
                            $detail[] = $item->product->color;
                        }
                        if ($item->product->size) {
                            $detail[] = $item->product->size;
                        }
                    }
                    if ($item->notes) {
                        $detail[] = $item->notes;
                    }
                @endphp
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td class="prod-name">{{ $item->product_name_snapshot }}</td>
                    <td class="detail">{{ $detail ? implode(' | ', $detail) : '-' }}</td>
                    <td class="num">{{ number_format($item->quantity) }}</td>
                    <td class="num">{{ rupiah($item->unit_price) }}</td>
                    <td class="num">{{ rupiah($item->subtotal) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align:center;color:#667085">Tidak ada item.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <table class="totals">
        <tr>
            <td class="label">Subtotal</td>
            <td class="num">{{ rupiah($order->subtotal) }}</td>
        </tr>
        @if ((float) $order->discount_amount > 0)
            <tr>
                <td class="label">Diskon</td>
                <td class="num">- {{ rupiah($order->discount_amount) }}</td>
            </tr>
        @endif
        @if ((float) $order->shipping_cost > 0)
            <tr>
                <td class="label">Ongkir</td>
                <td class="num">{{ rupiah($order->shipping_cost) }}</td>
            </tr>
        @endif
        <tr class="grand">
            <td>Grand Total</td>
            <td class="num brand-color">{{ rupiah($order->grand_total) }}</td>
        </tr>
        <tr>
            <td class="label">Total dibayar</td>
            <td class="num">{{ rupiah($order->paid_amount) }}</td>
        </tr>
        <tr>
            <td class="label">Sisa tagihan</td>
            <td class="num">{{ rupiah($order->remaining_amount) }}</td>
        </tr>
    </table>

    @if ((float) $order->remaining_amount > 0)
        <p class="payment-note">
            Sisa pembayaran <strong>{{ rupiah($order->remaining_amount) }}</strong> dapat ditransfer dan konfirmasi melalui WhatsApp.
        </p>
    @else
        <p class="payment-note">Pembayaran telah lunas. Terima kasih.</p>
    @endif

    @if ($order->notes)
        <div class="notes">
            <strong>Catatan:</strong> {{ $order->notes }}
        </div>
    @endif

    <div class="thanks">Terima kasih atas kepercayaan Anda - {{ $brandName }}</div>

    <div class="footer">
        {{ $brandName }} &nbsp;|&nbsp;
        @if ($companyAddress) {{ $companyAddress }}@endif
        @if ($companyPhone) &nbsp;|&nbsp; {{ $companyPhone }}@endif
        @if ($companyEmail) &nbsp;|&nbsp; {{ $companyEmail }}@endif
    </div>

</body>
</html>
