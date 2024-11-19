import 'package:flutter/material.dart';
import 'analyze_form.dart';
import 'login_page.dart';
import 'rosterbuilder_page.dart';
import 'user_session.dart';
import 'package:animated_text_kit/animated_text_kit.dart';

class AnalyzePage extends StatelessWidget {
  final Map<String, dynamic> user;

  const AnalyzePage({Key? key, required this.user}) : super(key: key);

  void logout(BuildContext context) {
    UserSession().clearSession();
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => const LoginPage()),
      (route) => false,
    );
  }

  void goToRosterPage(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const RosterBuilderPage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.person),
          onPressed: () => goToRosterPage(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.lock_rounded),
            onPressed: () => logout(context),
          ),
        ],
        title: Image.asset(
          'assets/football.JPG', // Path to your image
          height: 40,
          width: 40,
        ),
        centerTitle: true,
        backgroundColor: Colors.black,
      ),
      backgroundColor: Colors.black,
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            // Displaying Trade Analysis as animated text
            Container(
              margin: const EdgeInsets.symmetric(vertical: 10),
              height: 60,
              child: AnimatedTextKit(
                animatedTexts: [
                  ColorizeAnimatedText(
                    'Trade Analysis',
                    textStyle: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                    colors: [
                      Colors.purple, // Purple color
                      const Color.fromARGB(255, 0, 13, 87), // Dark blue
                      const Color.fromARGB(255, 0, 47, 255), // Bright blue
                      const Color.fromARGB(255, 204, 0, 255), // Pinkish-purple
                      const Color.fromARGB(255, 50, 0, 129), // Deep purple
                    ],
                   speed: const Duration(milliseconds: 600), // Slower animation

                  ),
                ],
                isRepeatingAnimation: true,
                repeatForever: true,
              ),
            ),
            Expanded(
              child: Container(
                color: Colors.black,
                child: AnalyzeForm(user: user),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
