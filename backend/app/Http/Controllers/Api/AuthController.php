<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    private const SESSION_MINUTES = 10;

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password tidak valid.'],
            ]);
        }

        $token = $user->createToken('frndly-token', ['*'], now()->addMinutes(self::SESSION_MINUTES))->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $this->payload($user),
                'token' => $token,
            ],
        ]);
    }

    public function refresh(Request $request): JsonResponse
    {
        PersonalAccessToken::query()
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->delete();

        $user = $request->user();

        $token = $user->createToken('frndly-token', ['*'], now()->addMinutes(self::SESSION_MINUTES))->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $this->payload($user),
                'token' => $token,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $this->payload($request->user()),
            ],
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:12', 'confirmed', 'different:current_password'],
        ]);

        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Password saat ini tidak benar.'],
            ]);
        }

        $user->update(['password' => Hash::make($data['password'])]);
        $user->tokens()->delete();
        $token = $user->createToken('frndly-token', ['*'], now()->addMinutes(self::SESSION_MINUTES))->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diubah.',
            'data' => [
                'user' => $this->payload($user->fresh()),
                'token' => $token,
            ],
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:40'],
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $this->payload($user->fresh()),
            ],
        ]);
    }

    public function updateAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar_path' => $path]);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $this->payload($user->fresh()),
            ],
        ]);
    }

    public function deleteAvatar(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
            $user->update(['avatar_path' => null]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $this->payload($user->fresh()),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil keluar.',
        ]);
    }

    private function payload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'avatar_url' => $user->avatar_path ? '/storage/' . $user->avatar_path : null,
        ];
    }
}
