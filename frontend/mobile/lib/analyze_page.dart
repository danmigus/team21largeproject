import 'package:flutter/material.dart';
import 'analyze_form.dart';

class AnalyzePage extends StatelessWidget {
  final Map<String, dynamic> user;

  const AnalyzePage({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Analyze')),
      body: AnalyzeForm(user: user),
    );
  }
}

