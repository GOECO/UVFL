
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

// --- MÔ HÌNH DỮ LIỆU & TRẠNG THÁI ---
enum ValueState { create, validate, distribute, renew }

class ValueRecord {
  final String id;
  final double amount;
  final String asset;
  final String hash;
  final ValueState state;
  final DateTime timestamp;

  ValueRecord({
    required this.id,
    required this.amount,
    required this.asset,
    required this.hash,
    required this.state,
    required this.timestamp,
  });
}

// --- QUẢN LÝ TRẠNG THÁI (RIVERPOD) ---
final valueRecordsProvider = StateProvider<List<ValueRecord>>((ref) => []);
final currentRoleProvider = StateProvider<String>((ref) => "CREATOR");

void main() {
  runApp(const ProviderScope(child: UVFLApp()));
}

class UVFLApp extends StatelessWidget {
  const UVFLApp({super.key});

  @override
  Widget build(BuildContext context) {
    final GoRouter _router = GoRouter(
      initialLocation: '/onboarding',
      routes: [
        GoRoute(path: '/onboarding', builder: (context, state) => const OnboardingScreen()),
        GoRoute(path: '/home', builder: (context, state) => const HomeScreen()),
        GoRoute(path: '/create', builder: (context, state) => const CreateValueScreen()),
        GoRoute(path: '/qr-scan', builder: (context, state) => const QRScannerScreen()),
        GoRoute(path: '/qr-gen/:id', builder: (context, state) => QRGeneratorScreen(id: state.pathParameters['id']!)),
        GoRoute(path: '/wallet', builder: (context, state) => const WalletScreen()),
        GoRoute(path: '/audit-log', builder: (context, state) => const AuditLogScreen()),
        GoRoute(path: '/roles', builder: (context, state) => const RolesScreen()),
        // Thêm 7 route khác cho đủ 15 màn hình...
      ],
    );

    return MaterialApp.router(
      title: 'UVFL Global Wallet',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2563EB),
          background: const Color(0xFFFDFC F0),
        ),
        fontFamily: 'Space Grotesk',
        useMaterial3: true,
      ),
      routerConfig: _router,
    );
  }
}

// --- MÀN HÌNH ONBOARDING ---
class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.account_tree, size: 80, color: Color(0xFF2563EB)),
            const SizedBox(height: 40),
            const Text('UVFL GLOBAL', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, letterSpacing: -1)),
            const SizedBox(height: 16),
            const Text(
              'Hệ sinh thái giá trị phi tập trung. Tạo giá trị, xác thực và thịnh vượng bền vững.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey, fontSize: 16),
            ),
            const SizedBox(height: 60),
            SizedBox(
              width: double.infinity,
              height: 60,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2563EB),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                onPressed: () => context.go('/home'),
                child: const Text('BẮT ĐẦU NGAY', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            )
          ],
        ),
      ),
    );
  }
}

// --- MÀN HÌNH DASHBOARD (HOME) ---
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final role = ref.watch(currentRoleProvider);
    return Scaffold(
      appBar: AppBar(
        title: const Text('DASHBOARD', style: TextStyle(fontWeight: FontWeight.black, fontSize: 14)),
        actions: [
          IconButton(onPressed: () => context.push('/qr-scan'), icon: const Icon(Icons.qr_code_scanner)),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildRoleCard(role),
            const SizedBox(height: 24),
            const Text('HOẠT ĐỘNG GẦN ĐÂY', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey)),
            const SizedBox(height: 12),
            _buildRecentActivity(),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        selectedItemColor: const Color(0xFF2563EB),
        unselectedItemColor: Colors.grey,
        onTap: (index) {
          if (index == 1) context.push('/create');
          if (index == 2) context.push('/wallet');
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.add_circle), label: 'Create'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
        ],
      ),
    );
  }

  Widget _buildRoleCard(String role) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: const Color(0xFFE5E2D1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('VAI TRÒ HIỆN TẠI', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
          Text(role, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.black, color: Color(0xFF2563EB))),
          const SizedBox(height: 16),
          const LinearProgressIndicator(value: 0.94, backgroundColor: Color(0xFFF5F3E7), color: Colors.emerald),
          const SizedBox(height: 8),
          const Text('KPI Chu kỳ: 94.5%', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildRecentActivity() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
      child: const Center(child: Text('Chưa có dữ liệu Ledger local', style: TextStyle(color: Colors.grey))),
    );
  }
}

// --- MÀN HÌNH TẠO GIÁ TRỊ ---
class CreateValueScreen extends ConsumerStatefulWidget {
  const CreateValueScreen({super.key});
  @override
  _CreateValueScreenState createState() => _CreateValueScreenState();
}

class _CreateValueScreenState extends ConsumerState<CreateValueScreen> {
  final TextEditingController _amountController = TextEditingController();
  
  void _handleSubmit() {
    // Logic: Lưu local -> Tạo Hash -> Chờ Sync hoặc QR Validate
    final newRecord = ValueRecord(
      id: "REC-${DateTime.now().millisecondsSinceEpoch}",
      amount: double.tryParse(_amountController.text) ?? 0,
      asset: "USDT",
      hash: "offline_hash_v1",
      state: ValueState.create,
      timestamp: DateTime.now(),
    );
    ref.read(valueRecordsProvider.notifier).update((state) => [newRecord, ...state]);
    context.push('/qr-gen/${newRecord.id}');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('TẠO GIÁ TRỊ')),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Số lượng giá trị (USDT)', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 24),
            ElevatedButton(onPressed: _handleSubmit, child: const Text('LƯU & XÁC THỰC')),
          ],
        ),
      ),
    );
  }
}

// --- MÀN HÌNH QR SCANNER (OFFLINE VALIDATION) ---
class QRScannerScreen extends StatelessWidget {
  const QRScannerScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('XÁC THỰC PEER-TO-PEER')),
      body: const Center(child: Text('Giao diện Camera/Scanner sẽ hiển thị ở đây')),
    );
  }
}

// --- CÁC MÀN HÌNH CÒN LẠI (SKELETON) ---
class QRGeneratorScreen extends StatelessWidget {
  final String id;
  const QRGeneratorScreen({super.key, required this.id});
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: Text('MÃ QR: $id')), body: const Center(child: Icon(Icons.qr_code, size: 200)));
}
class WalletScreen extends StatelessWidget { const WalletScreen({super.key}); @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text("VÍ GIÁ TRỊ"))); }
class AuditLogScreen extends StatelessWidget { const AuditLogScreen({super.key}); @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text("NHẬT KÝ BĂM"))); }
class RolesScreen extends StatelessWidget { const RolesScreen({super.key}); @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text("VAI TRÒ & KPI"))); }
