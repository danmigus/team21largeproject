
import 'package:flutter/material.dart';
import 'login_page.dart';
import 'register_page.dart';
import 'reset_password_page.dart';
import 'resend_verification_page.dart';
import 'set_password_page.dart';
import 'analyze_page.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.dark(),
      initialRoute: '/',
      onGenerateRoute: (settings) {
        if (settings.name == '/analyze') {
          final Map<String, dynamic> user = settings.arguments as Map<String, dynamic>;
          return MaterialPageRoute(
            builder: (context) => AnalyzePage(user: user),
          );
        }

        // Default routes
        switch (settings.name) {
          case '/':
            return MaterialPageRoute(builder: (context) => const LoginPage());
          case '/register':
            return MaterialPageRoute(builder: (context) => RegisterPage());
          case '/resetpassword':
            return MaterialPageRoute(builder: (context) => ResetPasswordPage());
          case '/resend':
            return MaterialPageRoute(builder: (context) => ResendVerificationPage());
          case '/setpassword':
            return MaterialPageRoute(builder: (context) => SetPasswordPage());
          default:
            return null;
        }
      },
    );
  }
}

