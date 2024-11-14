import 'package:flutter/material.dart';
import 'analyze_form.dart';

class AnalyzePage extends StatelessWidget {
  final Map<String, dynamic> user;

  const AnalyzePage({Key? key, required this.user}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Trade Analysis", style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colors.blueGrey,
      ),
      body: Padding(
        padding: EdgeInsets.all(8.0),
        child: Column(
          children: [
            // Displaying Trade Value
            Container(
              margin: EdgeInsets.symmetric(vertical: 10),
              child: Text(
                "Trade Value: \0.00", // Initial value to be updated by AnalyzeForm
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
