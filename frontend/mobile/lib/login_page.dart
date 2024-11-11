import 'package:flutter/material.dart';
import 'login_form.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black, // Matches the dark background
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/football.JPG',
              width: 150, // Adjust as needed
            ),
            const SizedBox(height: 20),
            const LoginForm(),
          ],
        ),
      ),
    );
  }
}
