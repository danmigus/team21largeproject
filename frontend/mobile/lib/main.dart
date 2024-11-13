import 'package:flutter/material.dart';
import 'login_page.dart';
import 'analyze_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Trade Wizard',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const LoginPage(),
      routes: {
        '/': (context) => const LoginPage(),  // Define root route
        '/analyze': (context) => const AnalyzePage(),  // Define analyze route
      },
    );
  }
}



