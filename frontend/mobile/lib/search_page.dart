import 'package:flutter/material.dart';
import 'analyze_form.dart';

class AnalyzePage extends StatelessWidget {
  final Map<String, dynamic> user;

  const AnalyzePage({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Trade Analysis", style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colors.blueGrey,
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            // Displaying Trade Value
            Container(
              margin: const EdgeInsets.symmetric(vertical: 10),
              child: const Text(
                "Trade Value: 0.00", // Initial value to be updated by AnalyzeForm
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ),
            Expanded(
              child: AnalyzeForm(user: user),
            ),
          ],
        ),
      ),
    );
  }
}
