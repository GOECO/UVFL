
import 'package:flutter/material.dart';

void main() {
  runApp(const UVFLApp());
}

class UVFLApp extends StatelessWidget {
  const UVFLApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'UVFL Global',
      theme: ThemeData(
        primarySwatch: Colors.emerald,
        fontFamily: 'Inter',
        useMaterial3: true,
      ),
      initialRoute: '/onboarding',
      routes: {
        '/onboarding': (context) => const OnboardingScreen(),
        '/home': (context) => const HomeScreen(),
        '/create': (context) => const CreateValueScreen(),
        '/validate': (context) => const ValidationCenterScreen(),
        '/distribution': (context) => const DistributionScreen(),
        '/roles': (context) => const RolesScreen(),
        '/community': (context) => const CommunityScreen(),
        '/disputes': (context) => const DisputesScreen(),
        '/learn': (context) => const LearnScreen(),
        '/wallet': (context) => const WalletScreen(),
        '/analytics': (context) => const AnalyticsScreen(),
        '/notifications': (context) => const NotificationScreen(),
        '/profile': (context) => const ProfileScreen(),
        '/settings': (context) => const SettingsScreen(),
        '/transparency': (context) => const TransparencyScreen(),
      },
    );
  }
}

// Skeleton Screens below...
class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('UVFL GLOBAL', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/home'),
              child: const Text('Get Started'),
            )
          ],
        ),
      ),
    );
  }
}

// Placeholder for the 15 screens required
class HomeScreen extends StatelessWidget { const HomeScreen({super.key}); @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text("Dashboard"))); }
class CreateValueScreen extends StatelessWidget { const CreateValueScreen({super.key}); @override Widget build(BuildContext context) => const Scaffold(); }
class ValidationCenterScreen extends StatelessWidget { const ValidationCenterScreen({super.key}); @override Widget build(BuildContext context) => const Scaffold(); }
class DistributionScreen extends StatelessWidget { const DistributionScreen({super.key}); @override Widget build(BuildContext context) => const Scaffold(); }
class RolesScreen extends StatelessWidget { const RolesScreen({super.key}); @override Widget build(BuildContext context) => const Scaffold(); }
class CommunityScreen extends StatelessWidget { const CommunityScreen({super.key}); @override Widget build(BuildContext context) => const Scaffold(); }
class DisputesScreen extends StatelessWidget { const DisputesScreen({super.key}); @override Widget build(BuildContext context) => const Scaffold(); }
class LearnScreen extends StatelessWidget { const LearnScreen({super.key}); @override Widget build(BuildContext context) => const Scaffold(); }
class WalletScreen extends StatelessWidget { const WalletScreen({super.key}); @override Widget build(BuildContext context) => const Scaffold(); }
class AnalyticsScreen extends StatelessWidget { const AnalyticsScreen({super.key}); @override Widget build(BuildContext context) => const Scaffold(); }
class NotificationScreen extends StatelessWidget { const NotificationScreen({super.key}); @override Widget build(BuildContext context) => const Scaffold(); }
class ProfileScreen extends StatelessWidget { const ProfileScreen({super.key}); @override Widget build(BuildContext context) => const Scaffold(); }
class SettingsScreen extends StatelessWidget { const SettingsScreen({super.key}); @override Widget build(BuildContext context) => const Scaffold(); }
class TransparencyScreen extends StatelessWidget { const TransparencyScreen({super.key}); @override Widget build(BuildContext context) => const Scaffold(); }
